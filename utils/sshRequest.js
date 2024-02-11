const { readFileSync } = require('fs');
const os = require('os');
const path = require('path');
const { Client, utils } = require('ssh2');

const TYPE_VALUES = ['connect:key', 'connect:password', 'disconnect', 'exec', 'stream'];
const privateKeyPath = path.join(os.homedir(), '.ssh', 'id_rsa');

const conn = new Client();
let uptimeInterval;

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
  }
};

const getAuthMethod = (type, data) => {
  if (type === 'connect:password') {
    return { password: data.password };
  } else if (type === 'connect:key') {
    const privateKey = readFileSync(privateKeyPath, 'utf8');
    const auth = { privateKey: Buffer.from(privateKey) };

    if (IsSSHKeyEncrypted(privateKey))
      auth.passphrase = data.passphrase;

    return auth;
  };
};

const startUptimeChecking = (conn) => {
  return setInterval(() => {
    conn.exec('uptime', (err, stream) => {
      if (err) return callback(err);
    });
  }, 10000);
};

module.exports = (type, data, callback) => {
  if (!type || typeof type != 'string' || !TYPE_VALUES.includes(type))
    return callback('bad_request');

  if (!data || typeof data != 'object')
    return callback('bad_request');

  const { username = 'root', port = '22', host, command } = data;

  if (type.includes('connect:')) {
    conn.on('ready', () => {
      uptimeInterval = startUptimeChecking(conn);
      
      callback(null, 'Connected');
    });
    
    conn.on('error', err => {
      if (err.level == 'client-authentication')
        callback('authentication_failed');
    });

    conn.connect({
      username,
      port,
      host,
      ...getAuthMethod(type, data)
    });
  } else if (type.includes('disconnect')) {
    clearInterval(uptimeInterval);
    conn.end();
    callback(null, 'Disconnected');
  } else if (type.includes('exec')) {
    conn.exec(command, (err, stream) => {
      if (err) return callback(err);

      let stdout = '';
      
      stream.on('data', data => {
        stdout += data;
      }).on('close', () => {
        callback(null, stdout);
      });
    });
  } else if (type.includes('stream')) {
    // leave this for now
  };
};