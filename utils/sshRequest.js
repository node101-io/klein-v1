const { readFileSync } = require('fs');
const os = require('os');
const path = require('path');
const { Client, utils } = require('ssh2');

const TYPE_VALUES = ['connect', 'disconnect', 'exec', 'stream'];
const privateKeyPath = path.join(os.homedir(), '.ssh', 'id_rsa');

const conn = new Client();
let uptimeIntervalId = null;

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

const startUptimeChecks = (callback) => {
  const checkUptime = () => {
    conn.exec('uptime', (err, stream) => {
      if (err) {
        callback(err, null);
        return;
      };

      let stdout = '';

      stream.on('data', data => {
        stdout += data;
      })
      
      stream.on('close', () => {
        callback(null, stdout);
      });
    });
  };

  uptimeIntervalId = setInterval(checkUptime, 10000);
};

const stopUptimeChecks = () => {
  if (uptimeIntervalId) {
    clearInterval(uptimeIntervalId);
    uptimeIntervalId = null;
  }
};

module.exports = (type, data, callback) => {
  if (!type || typeof type != 'string' || !TYPE_VALUES.includes(type))
    return callback('bad_request');

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (type == 'connect' && !data.host)
    return callback('bad_request');

  if (type == 'exec' && !data.command)
    return callback('bad_request');

  const { username = 'root', port = '22', host } = data;

  if (type == 'connect') {
    conn.on('ready', () => {
      startUptimeChecks();
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
      ...getAuthMethod(data)
    });
  } else if (type == 'disconnect') {
    stopUptimeChecks();
    conn.end();
    callback(null, 'Disconnected');
  } else if (type == 'exec') {
    conn.exec(data.command, (err, stream) => {
      if (err) return callback(err);

      let stdout = '';
      
      stream.on('data', data => {
        stdout += data;
      }).on('close', () => {
        callback(null, stdout);
      });
    });
  } else if ( type == 'stream') {
    // leave this for now
  };
};