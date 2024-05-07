const fs = require('fs');
const os = require('os');
const path = require('path');
const { app } = require('electron');

const defaultPreferences = {
  theme: 'dark',
  sshFolderPath: 'default'
};

const preferencesPath = path.join(app.getPath('userData'), 'preferences.json');

const isLocalPreferencesObjectMatchDefaultSchema = preferences => {
  if (!preferences || typeof preferences != 'object')
    return false;

  const preferencesKeys = Object.keys(preferences);
  const defultKeys = Object.keys(defaultPreferences);

  if (preferencesKeys.length != defultKeys.length)
    return false;

  for (let i = 0; i < defultKeys.length; i++)
    if (preferencesKeys[i] != defultKeys[i])
      return false;

  return true;
};

const getLocalPreferences = callback => {
  let localPreferences = {};
  let isLocalPreferencesInitialized = true;

  try {
    localPreferences = require(preferencesPath);
  } catch (err) {
    isLocalPreferencesInitialized = false;
  };

  if (!isLocalPreferencesInitialized)
    Preferences.createOrUpdate(defaultPreferences, (err, createdLocalPreferences) => {
      if (err) return callback(err);

      return callback(null, createdLocalPreferences);
    });
  else if (!isLocalPreferencesObjectMatchDefaultSchema(localPreferences))
    Preferences.createOrUpdate(localPreferences, (err, fixedLocalPreferences) => {
      if (err) return callback(err);

      return callback(null, fixedLocalPreferences);
    });
  else
    return callback(null, localPreferences);
};

const Preferences = {
  init: callback => {
    getLocalPreferences((err, preferences) => {
      if (err) return callback(err);

      return callback(null, preferences);
    });
  },
  createOrUpdate: (preferences, callback) => {
    if (!preferences || typeof preferences != 'object')
      return callback('bad_request');

    const fixedPreferences = {};

    Object.keys(defaultPreferences).forEach(key => {
      fixedPreferences[key] = preferences[key] || defaultPreferences[key];
    });

    fs.writeFile(preferencesPath, JSON.stringify(fixedPreferences, null, 2), err => {
      if (err && err.code != 'ENOENT') return callback('error_writing_file');
      if (err) return callback(err);

      return callback(null, fixedPreferences);
    });
  },
  get: (key, callback) => {
    if (!key || typeof key != 'string' || !key.trim() || !defaultPreferences[key])
      return callback('bad_request');

    getLocalPreferences((err, preferences) => {
      if (err) return callback(err);

      if (key == 'sshFolderPath' && preferences[key] == 'default')
        return callback(null, path.join(os.homedir(), '.ssh'));

      return callback(null, preferences[key]);
    });
  },
  set: (key, value, callback) => {
    if (!key || typeof key != 'string' || !key.trim() || !defaultPreferences[key])
      return callback('bad_request');

    if (!value || typeof value != typeof defaultPreferences[key])
      return reject('bad_request');

    getLocalPreferences((err, preferences) => {
      if (err) return callback(err);

      preferences[key] = value;

      fs.writeFile(preferencesPath, JSON.stringify(preferences, null, 2), err => {
        if (err && err.code != 'ENOENT') return callback('error_writing_file');
        if (err) return callback(err);

        return callback(null, value);
      });
    });
  }
};

module.exports = Preferences;