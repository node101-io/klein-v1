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


// IsSSHKeyEncrypted() here

// getAuthMethod() here

module.exports = (type, data, callback) => {
  if (!type || typeof type != 'string' || !TYPE_VALUES.includes(type))
    return callback('bad_request');

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (type == 'connect') {
    // type checks here

    // connection here
  } else if (type == 'exec') {
    // type checks here

    // exec here
  } else if (type == 'stream') {
    // leave this for now
  };
};