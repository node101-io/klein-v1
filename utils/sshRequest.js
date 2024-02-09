const fs = require('fs');
const os = require('os');
const path = require('path');
const ssh2 = require('ssh2');

const TYPE_VALUES = ['connect', 'disconnect', 'exec', 'stream'];

const conn = new ssh2.Client();

// leave this for now, will implement later
// class SSHConnection {
//   constructor(id, client) {
//     this.id = id;
//     this.client = client;
//     this.lastSeenAt = Date.now();
//   };
// };


const IsSSHKeyEncrypted = (privateKey) => {
  const parsedKey = utils.parseKey(privateKey);

  if (Array.isArray(parsedKey)) {
    return parsedKey.some(key =>
      key instanceof Error &&
      key.message.includes('Encrypted private key detected, but no passphrase given')
    );
  } else if (parsedKey instanceof Error) {
    return parsedKey.message.includes('Encrypted private key detected, but no passphrase given');
  } else {
    return false;
  };
};

const getAuthMethod = (data) => {
  if (data.password) {
    return { password: data.password };
  } else if (privateKeyPath) {
    const privateKey = readFileSync(privateKeyPath, 'utf8');
    const auth = { privateKey: Buffer.from(privateKey) };

    if (IsSSHKeyEncrypted(privateKey))
      auth.passphrase = data.passphrase;

    return auth;
  };
};

module.exports = (type, data, callback) => {
  if (!type || typeof type != 'string' || !TYPE_VALUES.includes(type))
    return callback('bad_request');

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (type == 'connect') {
    conn.on('ready', () => {
      callback(null, 'Connected');
    }).on('error', err => {
      callback(err);
    }).connect({
      host: data.host,
      port: data.port,
      username: data.username,
      ...getAuthMethod(data)
    });
  } else if (type == 'disconnect') {
    conn.end();
    callback();
  } else if (type == 'exec') {
    conn.exec(data.command, (err, stream) => {
      if (err) return callback(err);

      let stdout = '';

      stream.on('data', data => {
        stdout += data;
      });
      
      stream.on('close', () => {
        callback(null, stdout);
      });
    });
  } else if (type == 'stream') {
    // leave this for now
  };
};