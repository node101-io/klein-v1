const fs = require('fs');
const os = require('os');
const path = require('path');
const { app } = require('electron');

const defaultPreferences = {
  sshFolderPath: path.join(os.homedir(), '.ssh') // TODO: what if user changes username?
};

const preferencesPath = path.join(app.getPath('userData'), 'preferences.json');

const Preferences = {
  init() {
    let preferences = {};

    try {
      preferences = require(preferencesPath);

      Object.keys(preferences).forEach(key => {
        if (!defaultPreferences[key])
          delete preferences[key];
      });
    } catch (e) {
      fs.writeFileSync(preferencesPath, JSON.stringify({}));
    };

    Object.keys(defaultPreferences).forEach(key => {
      if (!preferences[key])
        preferences[key] = defaultPreferences[key];
    });

    fs.writeFileSync(preferencesPath, JSON.stringify(preferences, null, 2));
  },
  get(key) {
    return require(preferencesPath)[key];
  },
  set(key, value) {
    const preferences = require(preferencesPath);

    preferences[key] = value;

    fs.writeFileSync(preferencesPath, JSON.stringify(preferences, null, 2));
  }
};

module.exports = Preferences;