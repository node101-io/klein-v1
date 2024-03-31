const crypto = require('crypto');
const electron = require('electron');

let appKey = null;
let isEncryptionAvailable = false;

const Instance = {
  create() {
    isEncryptionAvailable = electron.safeStorage.isEncryptionAvailable();

    appKey = isEncryptionAvailable ?
      electron.safeStorage.encryptString(crypto.randomBytes(16).toString('hex')) :
      crypto.randomBytes(16).toString('hex');

    return appKey;
  },
  get() {
    return isEncryptionAvailable ?
      electron.safeStorage.decryptString(appKey) :
      appKey;
  }
};

module.exports = Instance;