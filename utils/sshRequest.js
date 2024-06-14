const fs = require('fs');
const path = require('path');
const ssh2 = require('ssh2');

const jsonify = require('./jsonify');

const WebSocketServer = require('./webSocketServer');
const Preferences = require('./preferences');

const SFTP_STATUS_CODES = ssh2.utils.sftp.STATUS_CODE;

const ENCRYPTED_KEY_MESSAGE = 'Encrypted';
const ERROR_MESSAGE_BAD_PASSPHRASE = 'bad passphrase';

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
  'exec:stream',
  'sftp:read_file',
  'sftp:write_file',
  'sftp:append_file',
  'sftp:readdir',
  'sftp:mkdir',
  'sftp:exists',
  'sftp:rename',
  'sftp:get_file',
  'sftp:upload_file'
];

const handleSFTPError = code => {
  if (code == SFTP_STATUS_CODES.OK)
    return null;
  else if (code == SFTP_STATUS_CODES.EOF)
    return 'eof_error';
  else if (code == SFTP_STATUS_CODES.NO_SUCH_FILE)
    return 'document_not_found';
  else if (code == SFTP_STATUS_CODES.PERMISSION_DENIED)
    return 'permission_denied';
  else if (code == SFTP_STATUS_CODES.FAILURE)
    return 'unknown_error';
  else if (code == SFTP_STATUS_CODES.BAD_MESSAGE)
    return 'bad_message';
  else if (code == SFTP_STATUS_CODES.NO_CONNECTION)
    return 'no_connection';
  else if (code == SFTP_STATUS_CODES.CONNECTION_LOST)
    return 'connection_lost';
  else if (code == SFTP_STATUS_CODES.OP_UNSUPPORTED)
    return 'unsupported_operation';
  else
    return 'unknown_error';
};

const isSSHKeyEncrypted = privateKey => {
  const parsedKey = ssh2.utils.parseKey(privateKey); // TODO: try-catch

  if (Array.isArray(parsedKey))
    return parsedKey.some(key => key instanceof Error && key.message.includes(ENCRYPTED_KEY_MESSAGE));

  if (parsedKey instanceof Error)
    return parsedKey.message.includes(ENCRYPTED_KEY_MESSAGE);

  return false;
};

const makeConnections = _ => {
  const connections = {};
  let endExpiredConnectionsLastCalledTime = 0;

  return {
    create(id, host) {
      const ws = WebSocketServer.get();

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
          this.removeByHost(host); // TODO: check usage of this

          return ws.send(JSON.stringify({
            id: id,
            type: 'close'
          }));
        });

      connections[host] = {
        client: client,
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

      return setTimeout(this.endExpiredConnections, END_EXPIRED_CONNECTIONS_INTERVAL); // TODO: check usage of this
    }
  };
};

const performPreExecActions = (data, callback) => {
  if ('in_container' in data && typeof data.in_container == 'boolean' && data.in_container) {
    const scriptName = `klein_script_${Date.now()}.sh`;

    const scriptPathHost = `/var/lib/docker/volumes/klein-node_klein-scripts-volume/_data/${scriptName}`;
    const scriptPathContainer = `/root/klein-scripts/${scriptName}`;

    sshRequest('sftp:write_file', {
      host: data.host,
      path: scriptPathHost,
      content: data.command
    }, err => {
      if (err)
        return callback(err);

      data.command = `chmod +x ${scriptPathHost} && docker exec --interactive klein-node bash ${scriptPathContainer}; rm -f ${scriptPathHost}`;

      return callback(null, data);
    });
  } else {
    data.command = `source $HOME/.bash_profile 2>/dev/null; ${data.command}`;

    return callback(null, data);
  };
};

const connections = makeConnections();

const sshRequest = (type, data, callback) => {
  connections.endExpiredConnections();

  if (!type || typeof type != 'string' || !TYPE_VALUES.includes(type))
    return callback('bad_request');

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (!data.host || typeof data.host != 'string' || !data.host.trim().length)
    return callback('bad_request');

  const ws = WebSocketServer.get();

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
      keepaliveInterval: SSH_KEEP_ALIVE_INTERVAL,
      keepaliveCountMax: 3
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

    performPreExecActions(data, (err, data) => {
      if (err)
        return callback(err);

      if (type == 'exec') {
        try {
          connection.client.exec(data.command, (err, stream) => {
            if (err)
              return callback(err);

            let stdout = '';
            let stderr = '';

            stream
              .on('data', stdout_data => {
                stdout += stdout_data;
              })
              .on('close', (code, signal) => {
                connection.markAsSeen();

                console.log('code:', code);
                console.log('stderr:', stderr);
                console.log('stdout:', stdout);
                if (code == 0)
                  return callback(null, stderr.trim() || stdout.trim() || null);

                if (code == 1)
                  return callback(stderr.trim() || stdout.trim() || null, null);

                if (code == 2)
                  return callback('shell_syntax_error', stderr.trim() || stdout.trim() || null);

                if (code == 126)
                  return callback('command_cannot_execute', stderr.trim() || stdout.trim() || null);

                if (code == 127)
                  return callback('command_not_found', stderr.trim() || stdout.trim() || null);

                if (code == 128)
                  return callback('invalid_exit_argument', stderr.trim() || stdout.trim() || null);

                if (code == 130)
                  return callback('user_interruption', stderr.trim() || stdout.trim() || null);

                if (code == 255)
                  return callback('unknown_error', stderr.trim() || stdout.trim() || null);

                return callback(stderr.trim() || null, stdout.trim() || null);
              })
              .stderr.on('data', stderr_data => {
                stderr += stderr_data;
              })
          });
        } catch (err) {
          console.error(err);
          return callback('timed_out');
        };
      } else if (type == 'exec:stream') {
        if (!data.id || typeof data.id != 'string' || !data.id.trim().length)
          return callback('bad_request');

        if (!ws || ws.readyState != ws.OPEN)
          return callback('websocket_error');

        try {
          connection.client.exec(data.command, (err, stream) => {
            if (err)
              return callback(err);

            connection.markAsSeen();

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
        } catch (err) {
          console.error(err);
          return callback('timed_out');
        };
      };
    });
  } else if (type == 'sftp:read_file' || type == 'sftp:write_file' || type == 'sftp:append_file' || type == 'sftp:readdir' || type == 'sftp:mkdir' || type == 'sftp:exists' || type == 'sftp:rename' || type == 'sftp:get_file' || type == 'sftp:upload_file') {
    const connection = connections.getByHost(data.host);

    if (!connection)
      return callback('bad_request');

    if (!connection.isReady())
      return callback('network_error');

    connection.client.sftp((err, sftp) => {
      if (err)
        return callback(err);

      if (!data.path || typeof data.path != 'string' || !data.path.trim().length)
        return callback('bad_request');

      if (type == 'sftp:read_file') {
        sftp.readFile(data.path, 'utf8', (err, content) => {
          if (err)
            return callback(handleSFTPError(err.code));

          return callback(null, content);
        });
      } else if (type == 'sftp:readdir') {
        sftp.readdir(data.path, (err, list) => {
          if (err)
            return callback(handleSFTPError(err.code));

          return callback(null, list);
        });
      } else if (type == 'sftp:mkdir') {
        sftp.mkdir(data.path, {}, err => {
          if (err)
            return callback(handleSFTPError(err.code));

          return callback(null);
        });
      } else if (type == 'sftp:exists') {
        sftp.stat(data.path, (err, stats) => {
          if (err)
            return callback(handleSFTPError(err.code));

          return callback(null, stats);
        });
      } else if (type == 'sftp:write_file' || type == 'sftp:append_file') {
        if (!data.content || typeof data.content != 'string' || !data.content.length)
          return callback('bad_request');

        if (type == 'sftp:write_file')
          sftp.writeFile(data.path, data.content, err => {
            if (err)
              return callback(handleSFTPError(err.code));

            return callback(null);
          });
        else if (type == 'sftp:append_file')
          sftp.appendFile(data.path, data.content, err => {
            if (err)
              return callback(handleSFTPError(err.code));

            return callback(null);
          });
        else
          return callback('not_possible_error');
      } else if (type == 'sftp:rename') {
        if (!data.newPath || typeof data.newPath != 'string' || !data.newPath.trim().length)
          return callback('bad_request');

        sftp.rename(data.path, data.newPath, err => {
          if (err)
            return callback(handleSFTPError(err.code));

          return callback(null);
        });
      } else if (type == 'sftp:get_file' || type == 'sftp:upload_file') {
        if (!data.localPath || typeof data.localPath != 'string' || !data.localPath.trim().length)
          return callback('bad_request');

        if (type == 'sftp:get_file')
          sftp.fastGet(data.path, data.localPath, err => {
            if (err)
              return callback(handleSFTPError(err.code));

            return callback(null);
          });
        else if (type == 'sftp:upload_file')
          sftp.fastPut(data.localPath, data.path, err => {
            if (err)
              return callback(handleSFTPError(err.code));

            return callback(null);
          });
        else
          return callback('not_possible_error');
      } else {
        return callback('not_possible_error');
      };
    });
  } else {
    return callback('not_possible_error');
  };
};

module.exports = sshRequest;