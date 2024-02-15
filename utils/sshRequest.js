const fs = require('fs');
const os = require('os');
const path = require('path');
const ssh2 = require('ssh2');
const ws = require('ws')

const DEFAULT_PRIVATE_KEY_PATH = path.join(os.homedir(), '.ssh', 'id_rsa');
const FIFTEN_MINUTES_IN_MS = 15 * 60 * 1000;
const TYPE_VALUES = [
  'connect:key',
  'connect:password',
  'disconnect',
  'exec',
  'exec:stream'
];

const connections = {};

// TODO: cron ile mi yapılmalı?
setInterval(() => {
  for (const host in connections) {
    if (Date.now() - connections[host].lastSeenAt > FIFTEN_MINUTES_IN_MS) {
      if (!connections[host].client._sock.destroyed)
        connections[host].client.end();
      
      delete connections[host];
    };
  };
});

let webSocket;
const wss = new ws.WebSocketServer({
  port: 8080
}).on('connection', ws => {
  webSocket = ws;
});

class SSHConnection {
  constructor() {
    this.client = new ssh2.Client();
    this.lastSeenAt = Date.now();
  };
};

const isSSHKeyEncrypted = privateKey => {
  const parsedKey = ssh2.utils.parseKey(privateKey);
  
  if (Array.isArray(parsedKey))
    return parsedKey.some(key => key instanceof Error && key.message.includes('Encrypted'));
  
  if (parsedKey instanceof Error)
    return parsedKey.message.includes('Encrypted');

  return false;
};

module.exports = (type, data, callback) => {
  if (!type || typeof type != 'string' || !TYPE_VALUES.includes(type))
    return callback('bad_request');

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (type == 'connect:password' || type == 'connect:key') {
    if (!data.host || typeof data.host != 'string' || !data.host.trim().length)
      return callback('bad_request');

    if (connections[data.host])
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
      connections[data.host].client.on('ready', () => {
        callback();
      }).on('close', () => {
        delete connections[data.host];
      }).on('timeout', () => {
        delete connections[data.host];

        callback('network_error');
      }).on('error', err => {
        delete connections[data.host];

        if (err.level == 'client-authentication')
          callback('authentication_failed');
      }).connect(connectData);
    } catch (err) {
      delete connections[data.host];

      if (err.message.includes('bad passphrase'))
        return callback('bad_passphrase');
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

    callback();
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
        
        stream.on('data', data => {
          console.log(Buffer.from(data).toString('utf8'));
          stdout += data;
        }).on('close', () => {
          connections[data.host].lastSeenAt = Date.now();

          callback(null, stdout);
        });
      });
    } else if (type == 'exec:stream') {
      connections[data.host].client.shell((err, stream) => {
        if (err) return callback(err);
        
        stream.on('data', streamData => {
          webSocket.send(JSON.stringify({
            host: data.host,
            data: Buffer.from(streamData).toString('utf8'),
          }));
        }).on('close', () => {
          callback(null, 'stream_closed');
        });
        stream.end(data.command + '\n');
      });
    };
  };
};