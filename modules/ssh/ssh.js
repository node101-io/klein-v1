const { Client, utils } = require('ssh2');
const { readFileSync } = require('fs');
const os = require('os');
const path = require('path');

const conn = new Client();

const privateKeyPath = path.join(os.homedir(), '.ssh', 'id_rsa');

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
  }
};

const sshConnect = (data, callback) => {
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
};

const sshDisconnect = (callback) => {
  conn.end();
};

const sshExec = (data, callback) => {
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
};

const sshStream = (data, callback) => {
  conn.on('ready', () => {
    conn.exec(data.command, (err, stream) => {
      if (err) return callback(err);

      stream.on('data', data => {
        callback(null, data.toString('utf8'));
      });
    })
  })
};

module.exports = {
  connect: sshConnect,
  disconnect: sshDisconnect,
  exec: sshExec,
  stream: sshStream
};