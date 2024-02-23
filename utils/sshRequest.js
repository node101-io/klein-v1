const fs = require('fs');
const os = require('os');
const path = require('path');
const ssh2 = require('ssh2');

const webSocketInstance = require('../websocket/Instance');

const ERROR_MESSAGE_BAD_PASSPHRASE = 'bad passphrase';
const ERROR_MESSAGE_NO_FILE = 'No such file or directory';
const CONNECTION_EXPIRED_INTERVAL = 30 * 1000;
const DEFAULT_SSH_FOLDER_PATH = path.join(os.homedir(), '.ssh');
const ENCRYPTED_KEY_MESSAGE = 'Encrypted';
const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
const ONE_MINUTE_IN_MS = 60 * 1000;
const SSH_CONNECT_TIMEOUT = 10 * 1000;
const SSH_KEEP_ALIVE_INTERVAL = 1000;
const SSH_KEY_TYPE_TO_GENERATE = 'rsa';
const SSH_KEY_BITS_TO_GENERATE = 1024;
const TYPE_VALUES = [
  'connect:key',
  'connect:password',
  'disconnect',
  'exec',
  'exec:stream',
  'key:local:create',
  'key:local:delete',
  'key:local:list',
  'key:remote:add',
  'key:remote:list',
  'key:remote:remove'
];

const connections = {};
let endExpiredConnectionsLastCalledTime = 0;

class SSHConnection {
  constructor() {
    this.client = new ssh2.Client();
    this.lastSeenAt = Date.now();
  };
};

const endExpiredConnections = () => {
  endExpiredConnectionsLastCalledTime = Date.now();

  if (!Object.keys(connections).length) {
    endExpiredConnectionsLastCalledTime = 0;
    return;
  };

  for (const host in connections)
    if (Date.now() - connections[host].lastSeenAt > FIFTEEN_MINUTES_IN_MS) {
      if (!connections[host].client._sock.destroyed)
        connections[host].client.end();

      delete connections[host]; // TODO: optimize delete
    };

  setTimeout(endExpiredConnections, CONNECTION_EXPIRED_INTERVAL);
};

const isSSHKeyEncrypted = privateKey => {
  const parsedKey = ssh2.utils.parseKey(privateKey);

  if (Array.isArray(parsedKey))
    return parsedKey.some(key => key instanceof Error && key.message.includes(ENCRYPTED_KEY_MESSAGE));

  if (parsedKey instanceof Error)
    return parsedKey.message.includes(ENCRYPTED_KEY_MESSAGE);

  return false;
};

module.exports = (type, data, callback) => {
  const sshRequest = module.exports;

  if (!type || typeof type != 'string' || !TYPE_VALUES.includes(type))
    return callback('bad_request');

  if (!data || typeof data != 'object')
    return callback('bad_request');

  const ws = webSocketInstance.get();

  if (Date.now() - endExpiredConnectionsLastCalledTime > ONE_MINUTE_IN_MS) {
    endExpiredConnectionsLastCalledTime = Date.now();

    endExpiredConnections();
  };

  if (type == 'connect:password' || type == 'connect:key') {
    if (!data.host || typeof data.host != 'string' || !data.host.trim().length)
      return callback('bad_request');

    if (connections[data.host])
      return callback('action_already_done');

    const connectData = {
      username: data.username && typeof data.username == 'string' && data.title.trim().length ? data.username.trim() : 'root',
      host: data.host.trim(),
      readyTimeout: SSH_CONNECT_TIMEOUT,
      keepaliveInterval: SSH_KEEP_ALIVE_INTERVAL
    };

    if (data.port && typeof data.port == 'number' && 0 < data.port)
      connectData.port = Number(data.port);

    if (type == 'connect:password') {
      if (!data.password || typeof data.password != 'string' || !data.password.length)
        return callback('bad_request');

      connectData.password = data.password;
    } else if (type == 'connect:key') {
      const privateKeyPath = data.privateKeyPath && typeof data.privateKeyPath == 'string' && data.privateKeyPath.trim().length ? data.privateKeyPath.trim() : path.join(DEFAULT_SSH_FOLDER_PATH, 'id_rsa');

      if (!fs.existsSync(privateKeyPath))
        return callback('document_not_found');

      const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

      connectData.privateKey = privateKey;

      if (isSSHKeyEncrypted(privateKey)) {
        if (!data.passphrase || typeof data.passphrase != 'string' || !data.passphrase.trim().length)
          return callback('bad_request');

        connectData.passphrase = data.passphrase;
      };
    };

    connections[data.host] = new SSHConnection();

    try {
      connections[data.host].client
        .on('ready', () => {
          return callback(null);
        })
        .on('timeout', () => {
          delete connections[data.host];

          return callback('timed_out');
        })
        .on('error', err => {
          delete connections[data.host];

          if (err && err.level == 'client-authentication')
            return callback('authentication_failed');

          if (err && err.level == 'client-socket')
            return callback('network_error');

          if (err && err.level == 'client-timeout')
            return callback('timed_out');

          return callback('unknown_error');
        })
        .connect(connectData);
    } catch (err) {
      delete connections[data.host];

      if (err.message.includes(ERROR_MESSAGE_BAD_PASSPHRASE))
        return callback('bad_passphrase');

      return callback('unknown_error');
    };
  } else if (type == 'disconnect') {
    if (!data.host || typeof data.host != 'string' || !data.host.trim().length)
      return callback('bad_request');

    if (!connections[data.host])
      return callback('bad_request');

    if (connections[data.host].client._sock.destroyed)
      return callback('network_error');

    connections[data.host].client.end();

    delete connections[data.host];

    callback(null);
  } else if (type == 'exec' || type == 'exec:stream') {
    if (!data.host || typeof data.host != 'string' || !data.host.trim().length)
      return callback('bad_request');

    if (!data.command || typeof data.command != 'string' || !data.command.trim().length)
      return callback('bad_request');

    if (!connections[data.host])
      return callback('bad_request');

    if (connections[data.host].client._sock.destroyed)
      return callback('network_error');

    if (type == 'exec') {
      connections[data.host].client.exec(data.command, (err, stream) => {
        if (err) return callback(err);

        let stdout = '';
        let stderr = '';

        stream
          .on('data', data => {
            stdout += data;
          })
          .on('close', () => {
            connections[data.host].lastSeenAt = Date.now();

            if (stderr && stderr.trim().length) {
              if (stderr.includes(ERROR_MESSAGE_NO_FILE))
                return callback('document_not_found');

              return callback(stderr.trim());
            };

            return callback(null, stdout);
          })
          .stderr.on('data', data => {
            stderr += data;
          });
      });
    } else if (type == 'exec:stream') {
      if (data.id && typeof data.id != 'string' && data.id.trim().length)
        return callback('bad_request');

      if (!ws || ws.readyState != ws.OPEN)
        return callback('websocket_error');

      connections[data.host].client.exec(data.command, (err, stream) => {
        if (err) return callback(err);

        stream
          .on('data', streamData => {
            ws.send(JSON.stringify({
              id: data.id,
              data: Buffer.from(streamData).toString('utf8'),
            }));
          })
          .on('close', () => callback(null));
        
        ws.on('message', message => {
          const parsedMessage = JSON.parse(message);

          if (parsedMessage.id == data.id && parsedMessage.type == 'end')
            stream.close();
        });
      });
    };
  } else if (type == 'key:local:create' || type == 'key:local:delete' || type == 'key:local:list') {
    const sshFolderPath = data.path && typeof data.path == 'string' && data.path.trim().length ? data.path.trim() : DEFAULT_SSH_FOLDER_PATH;

    if (!fs.existsSync(sshFolderPath))
      fs.mkdir(sshFolderPath, { recursive: true }, err => {
        if (err) return callback(err);
      });

    if (type == 'key:local:create') {
      const keyData = {
        bits: SSH_KEY_BITS_TO_GENERATE,
      };

      if (data.passphrase && typeof data.passphrase == 'string' && data.passphrase.trim().length)
        keyData.passphrase = data.passphrase;

      ssh2.utils.generateKeyPair(SSH_KEY_TYPE_TO_GENERATE, keyData, (err, keys) => {
        if (err) return callback(err);
        
        if (!data.filename || typeof data.filename != 'string' || !data.filename.trim().length)
          data.filename = `id_rsa_${Date.now()}`;

        fs.writeFile(path.join(sshFolderPath, data.filename), keys.private, err => {
          if (err) return callback(err);

          fs.writeFile(path.join(sshFolderPath, `${data.filename}.pub`), keys.public, err => {
            if (err) return callback(err);

            return callback(null);
          });
        });
      });
    } else if (type == 'key:local:delete') {
      if (!data.filename || typeof data.filename != 'string' || !data.filename.trim().length)
        return callback('bad_request');

      fs.unlink(path.join(sshFolderPath, `${data.filename}.pub`), err => {
        if (err && err.code == 'ENOENT') return callback('document_not_found');
        if (err) return callback(err);

        fs.unlink(path.join(sshFolderPath, data.filename), err => {
          if (err && err.code == 'ENOENT') return callback('document_not_found');
          if (err) return callback(err);

          return callback(null);
        });
      });
    } else if (type == 'key:local:list') {
      fs.readdir(sshFolderPath, (err, files) => {
        if (err) return callback(err);

        return callback(null, files.filter(file => file.endsWith('.pub')));
      });
    };
  } else if (type == 'key:remote:add' || type == 'key:remote:list' || type == 'key:remote:remove') {
    if (!data.host || typeof data.host != 'string' || !data.host.trim().length)
      return callback('bad_request');

    if (type == 'key:remote:add') {
      if (!data.pubkey || typeof data.pubkey != 'string' || !data.pubkey.trim().length)
        return callback('bad_request');

      sshRequest('exec', {
        host: data.host,
        command: `touch ~/.ssh/authorized_keys && echo "${data.pubkey}" >> ~/.ssh/authorized_keys`
      }, (err, res) => {
        if (err) return callback(err);

        return callback(null, res);
      });
    } else if (type == 'key:remote:list') {
      sshRequest('exec', {
        host: data.host,
        command: 'touch ~/.ssh/authorized_keys && cat ~/.ssh/authorized_keys'
      }, (err, res) => {
        if (err) return callback(err);

        return callback(null, res);
      });
    } else if (type == 'key:remote:remove') {
      if (!data.pubkey || typeof data.pubkey != 'string' || !data.pubkey.trim().length)
        return callback('bad_request');

      sshRequest('exec', {
        host: data.host,
        command: `touch ~/.ssh/authorized_keys && sed -i '/${data.pubkey}/d' ~/.ssh/authorized_keys`
      }, (err, res) => {
        if (err) return callback(err);

        return callback(null, res);
      });
    };
  } else {
    return callback('not_possible_error');
  };
};