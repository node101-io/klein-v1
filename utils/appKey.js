const { randomBytes } = require('crypto');
const { safeStorage } = require('electron');

let appKey = null;
let isEncryptionAvailable = false;

const AppKey = {
  create: _ => {
    const randomString = randomBytes(16).toString('hex');

    isEncryptionAvailable = safeStorage.isEncryptionAvailable();

    appKey = isEncryptionAvailable ? safeStorage.encryptString(randomString) : randomString;

    console.log(`AppKey created ${isEncryptionAvailable ? 'with' : 'without'} encryption.`);
  },
  get: _ => isEncryptionAvailable ? safeStorage.decryptString(appKey) : appKey
};

module.exports = AppKey;