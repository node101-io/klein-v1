const fs = require('fs');
const path = require('path');
const ssh2 = require('ssh2');

const jsonify = require('./jsonify');

const WebSocketServer = require('./webSocketServer');
const Preferences = require('./preferences');

const ENCRYPTED_KEY_MESSAGE = 'Encrypted';
const ERROR_MESSAGE_BAD_PASSPHRASE = 'bad passphrase';
const ERROR_MESSAGE_NO_FILE = 'No such file or directory';
const ERROR_MESSAGE_NO_COMMAND = 'command not found';

const END_EXPIRED_CONNECTIONS_EXPIRATION_TIME = 60 * 1000;
const END_EXPIRED_CONNECTIONS_INTERVAL = 30 * 1000;
const SSH_CONNECTION_EXPIRATION_TIME = 15 * 60 * 1000;
const SSH_HANDSHAKE_TIMEOUT = 10 * 1000;
const SSH_KEEP_ALIVE_INTERVAL = 1000;

const TYPE_VALUES = [
  'connect:key',
  'connect:password',
  'disconnect',
  'exec',
  'exec:stream'
];

let ws;

const isSSHKeyEncrypted = privateKey => {
  const parsedKey = ssh2.utils.parseKey(privateKey);

  if (Array.isArray(parsedKey))
    return parsedKey.some(key => key instanceof Error && key.message.includes(ENCRYPTED_KEY_MESSAGE));

  if (parsedKey instanceof Error)
    return parsedKey.message.includes(ENCRYPTED_KEY_MESSAGE);

  return false;
};

const executeCommand = (client, command, callback) => {
  try {
    client.exec(command, callback);
  } catch (err) {
    console.error(err);
    return callback('timed_out');
  };
};

const makeConnections = _ => {
  const connections = {};
  let endExpiredConnectionsLastCalledTime = 0;

  return {
    create(id, host) {
      let lastSeenAt = Date.now();

      const client = new ssh2.Client()
        .on('connect', _ => {
          return ws.send(JSON.stringify({
            id: id,
            type: 'connect'
          }));
        })
        .on('handshake', _ => {
          return ws.send(JSON.stringify({
            id: id,
            type: 'handshake'
          }));
        })
        .on('error', err => {
          if (err && err.level == 'client-authentication')
            return ws.send(JSON.stringify({
              id: id,
              type: 'authentication_failed'
            }));

          if (err && err.level == 'client-socket')
            return ws.send(JSON.stringify({
              id: id,
              type: 'network_error'
            }));

          if (err && err.level == 'client-timeout')
            return ws.send(JSON.stringify({
              id: id,
              type: 'timed_out'
            }));

          return ws.send(JSON.stringify({
            id: id,
            type: 'unknown_error'
          }));
        })
        .on('change password', _ => {
          return ws.send(JSON.stringify({
            id: id,
            type: 'change_password'
          }));
        })
        .on('ready', _ => {
          return ws.send(JSON.stringify({
            id: id,
            type: 'ready'
          }));
        })
        .on('timeout', _ => {
          return ws.send(JSON.stringify({
            id: id,
            type: 'timed_out'
          }));
        })
        .on('end', _ => {
          return ws.send(JSON.stringify({
            id: id,
            type: 'end'
          }));
        })
        .on('close', _ => {
          this.removeByHost(host);

          return ws.send(JSON.stringify({
            id: id,
            type: 'close'
          }));
        });

      connections[host] = {
        client,
        markAsSeen: _ => lastSeenAt = Date.now(),
        isExpired: _ => Date.now() - lastSeenAt > SSH_CONNECTION_EXPIRATION_TIME,
        isReady: _ => client._sock && !client._sock.destroyed
      };

      return connections[host];
    },
    getByHost(host) {
      return connections[host];
    },
    removeByHost(host) {
      delete connections[host];
    },
    endExpiredConnections() {
      if (Date.now() - endExpiredConnectionsLastCalledTime < END_EXPIRED_CONNECTIONS_EXPIRATION_TIME)
        return;

      endExpiredConnectionsLastCalledTime = Date.now();

      if (!Object.keys(connections).length)
        return endExpiredConnectionsLastCalledTime = 0;

      for (const host in connections)
        if (connections[host].isExpired())
          connections[host].client.end();

      return setTimeout(this.endExpiredConnections, END_EXPIRED_CONNECTIONS_INTERVAL);
    }
  };
};

const connections = makeConnections();

module.exports = (type, data, callback) => {
  connections.endExpiredConnections();

  if (!type || typeof type != 'string' || !TYPE_VALUES.includes(type))
    return callback('bad_request');

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (!data.host || typeof data.host != 'string' || !data.host.trim().length)
    return callback('bad_request');

  ws = WebSocketServer.get();

  if (type == 'connect:password' || type == 'connect:key') {
    if (connections.getByHost(data.host))
      return callback('action_already_done');

    if (!data.id || typeof data.id != 'string' || !data.id.trim().length)
      return callback('bad_request');

    if (!ws || ws.readyState != ws.OPEN)
      return callback('websocket_error');

    const connectData = {
      username: data.username && typeof data.username == 'string' && data.username.trim().length ? data.username.trim() : 'root',
      host: data.host.trim(),
      readyTimeout: SSH_HANDSHAKE_TIMEOUT,
      keepaliveInterval: SSH_KEEP_ALIVE_INTERVAL
    };

    if (data.port && typeof data.port == 'number' && 0 < data.port)
      connectData.port = Number(data.port);

    if (type == 'connect:password') {
      if (!data.password || typeof data.password != 'string' || !data.password.length)
        return callback('bad_request');

      connectData.password = data.password;
    } else if (type == 'connect:key') {
      if (!data.filename || typeof data.filename != 'string' || !data.filename.trim().length)
        return callback('bad_request');

      data.filename = data.filename.trim().replace(/\.pub$/, '');

      Preferences.get('sshFolderPath', (err, sshFolderPath) => {
        const privateKeyPath = path.join(sshFolderPath, data.filename);

        if (!fs.existsSync(privateKeyPath))
          return callback('document_not_found');

        const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

        connectData.privateKey = privateKey;

        if (isSSHKeyEncrypted(privateKey)) {
          if (!data.passphrase || typeof data.passphrase != 'string' || !data.passphrase.trim().length)
            return callback('bad_request');

          connectData.passphrase = data.passphrase;
        };
      });
    };

    const connection = connections.create(data.id, data.host);

    try {
      connection.client.connect(connectData);
    } catch (err) {
      console.error(err);
      if (err && err.message && typeof err.message == 'string' && err.message.includes(ERROR_MESSAGE_BAD_PASSPHRASE))
        return ws.send(JSON.stringify({
          id: data.id,
          type: 'bad_passphrase'
        }));

      return ws.send(JSON.stringify({
        id: data.id,
        type: 'unknown_error'
      }));
    };

    return callback(null);
  } else if (type == 'disconnect') {
    const connection = connections.getByHost(data.host);

    if (!connection)
      return callback('bad_request');

    if (!connection.isReady())
      return callback('network_error');

    connection.client.end();

    return callback(null);
  } else if (type == 'exec' || type == 'exec:stream') {
    if (!data.command || typeof data.command != 'string' || !data.command.trim().length)
      return callback('bad_request');

    const connection = connections.getByHost(data.host);

    if (!connection)
      return callback('bad_request');

    if (!connection.isReady())
      return callback('network_error');

    data.command = `source $HOME/.bash_profile 2>/dev/null; ${data.command}`;

    if (type == 'exec') {
      executeCommand(connection.client, data.command, (err, stream) => {
        if (err) return callback(err);

        let stdout = '';
        let stderr = '';

        stream
          .on('data', streamData => {
            stdout += streamData;
          })
          .on('close', _ => {
            connection.markAsSeen();

            if (stderr.includes(ERROR_MESSAGE_NO_FILE))
              return callback('document_not_found');

            if (stdout.includes(ERROR_MESSAGE_NO_COMMAND))
              return callback('command_not_found');

            return callback(stderr.trim() || null, stdout.trim() || null);
          })
          .stderr.on('data', data => {
            stderr += data;
          });
      });
    } else if (type == 'exec:stream') {
      if (!data.id || typeof data.id != 'string' || !data.id.trim().length)
        return callback('bad_request');

      if (!ws || ws.readyState != ws.OPEN)
        return callback('websocket_error');

      executeCommand(connection.client, data.command, (err, stream) => {
        if (err) return callback(err);

        let stdout = '';

        stream
          .on('data', streamData => {
            streamData = Buffer.from(streamData).toString('utf8');

            stdout += streamData;

            if (stdout.length > 1024 * 100)
              stdout = stdout.slice(stdout.length / 2);

            ws.send(JSON.stringify({
              id: data.id,
              data: streamData,
            }));
          })
          .on('close', _ => {
            connection.markAsSeen();

            return callback(null, stdout);
          });

        ws.on('message', message => {
          const parsedMessage = jsonify(message);

          if (parsedMessage.id == data.id && parsedMessage.type == 'end')
            stream.close();
        });
      });
    };
  } else {
    return callback('not_possible_error');
  };
};