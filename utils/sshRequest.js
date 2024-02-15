const fs = require('fs');
const os = require('os');
const path = require('path');
const ssh2 = require('ssh2');
const sshpk = require('sshpk');

const DEFAULT_PRIVATE_KEY_PATH = path.join(os.homedir(), '.ssh', 'id_rsa');
const TYPE_VALUES = ['connect:key', 'connect:password', 'disconnect', 'exec', 'stream'];

const CONNECTIONS = {};

class SSHConnection {
  constructor() {
    this.client = new ssh2.Client();
    this.lastSeenAt = Date.now();
  };
};

const parseKey = (privateKey, callback) => {
  try {
    const parsedKey = sshpk.parseKey(privateKey, 'auto', { passphrase: 'essek' });
    callback(null, parsedKey);
  } catch (err) {
    console.log(1, err);
    callback(err);
  };
};

const isSSHKeyEncrypted = privateKey => {
  // const parsedKey = ssh2.utils.parseKey(privateKey);

  // if (Array.isArray(parsedKey)) {
  //   return parsedKey.some(key =>
  //     key instanceof Error &&
  //     key.message.includes('Encrypted private key detected, but no passphrase given')
  //   );
  // } else if (parsedKey instanceof Error) {
  //   return parsedKey.message.includes('Encrypted private key detected, but no passphrase given');
  // } else {
  //   return false;
  // };

  // const key = sshpk.parsePrivateKey(privateKey, 'auto', { passphrase: 'essek' });
  parseKey(privateKey, (err, key) => {
    if (err)
      return false;

    return key.parts.privateKeyPassphrase ? true : false;
  });
};

module.exports = (type, data, callback) => {
  if (!type || typeof type != 'string' || !TYPE_VALUES.includes(type))
    return callback('bad_request');

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (type == 'connect:password' || type == 'connect:key') {
    if (!data.host || typeof data.host != 'string' || !data.host.trim().length)
      return callback('bad_request');

    if (CONNECTIONS[data.host])
      return callback('bad_request');

    const connectData = {
      username: data.username && typeof data.username == 'string' && data.title.trim().length ? data.username.trim() : 'root',
      host: data.host.trim(),
      readyTimeout: 5000,
      keepaliveInterval: 1000
    };

    if (data.port && typeof data.port == 'number' && 0 < data.port)
      connectData.port = Number(data.port);

    if (type == 'connect:password') {
      if (!data.password || typeof data.password != 'string' || !data.password.length)
        return callback('bad_request');

      connectData.password = data.password;
    } else if (type == 'connect:key') {
      const privateKeyPath = data.privateKeyPath && typeof data.privateKeyPath == 'string' && data.privateKeyPath.trim().length ? data.privateKeyPath.trim() : DEFAULT_PRIVATE_KEY_PATH;

      if (!fs.existsSync(privateKeyPath))
        return callback('document_not_found');

      const unbufferedPrivateKey = fs.readFileSync(privateKeyPath, 'utf8');

      connectData.privateKey = Buffer.from(unbufferedPrivateKey) // TODO: gerek olmayabilir

      console.log(isSSHKeyEncrypted(unbufferedPrivateKey));
      if (isSSHKeyEncrypted(unbufferedPrivateKey)) {
        if (!data.passphrase || typeof data.passphrase != 'string' || !data.passphrase.trim().length)
          return callback('bad_request');

        connectData.passphrase = data.passphrase;
      };
    };

    CONNECTIONS[data.host] = new SSHConnection();

    CONNECTIONS[data.host].client.on('ready', () => {
      callback();
    }).on('close', () => {
      delete CONNECTIONS[data.host];
    }).on('timeout', () => {
      callback('network_error');
    }).on('error', err => {
      if (err.level == 'client-authentication')
        callback('authentication_failed');
    }).connect(connectData);
  } else if (type == 'disconnect') {
    if (!data.host || typeof data.host != 'string' || !data.host.trim().length)
      return callback('bad_request');

    if (!CONNECTIONS[data.host])
      return callback('bad_request');

    CONNECTIONS[data.host].client.end();

    delete CONNECTIONS[data.host];

    callback(null, 'disconnected');
  } else if (type == 'exec') {
    // TODO: lastSeenAt güncelle
    if (!data.host || typeof data.host != 'string' || !data.host.trim().length)
      return callback('bad_request');

    if (!data.command || typeof data.command != 'string' || !data.command.trim().length)
      return callback('bad_request');

    if (!CONNECTIONS[data.host])
      return callback('bad_request');

    if (CONNECTIONS[data.host].client._sock.destroyed)
      return callback('network_error');

    CONNECTIONS[data.host].client.exec(data.command, (err, stream) => {
      if (err) return callback(err);

      let stdout = '';
      
      stream.on('data', data => {
        stdout += data;
      }).on('close', () => {
        callback(null, stdout);
      });
    });
  } else if (type == 'stream') {
    // leave this for now
  };
};