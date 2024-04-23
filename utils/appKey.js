const { randomBytes } = require('crypto');
const { safeStorage } = require('electron');

let appKey = null;
let isEncryptionAvailable = false;

const AppKey = {
  create: callback => {
    isEncryptionAvailable = safeStorage.isEncryptionAvailable();

    const randomString = randomBytes(16).toString('hex');

    appKey = isEncryptionAvailable ? safeStorage.encryptString(randomString) : randomString;

    return callback(null, {
      key: appKey,
      encrypted: isEncryptionAvailable
    });
  },
  get: _ => isEncryptionAvailable ? safeStorage.decryptString(appKey) : appKey
};

module.exports = AppKey;