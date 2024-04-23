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

  try {
    localPreferences = require(preferencesPath);
  } catch (err) {
    return callback('not_initialized');
  };

  if (!isLocalPreferencesObjectMatchDefaultSchema(localPreferences))
    return callback('not_initialized');

  return callback(null, localPreferences);
};

const Preferences = {
  init: callback => {
    getLocalPreferences(preferences => {
      Preferences.createOrUpdate(preferences, (err, finalPreferences) => {
        if (err) return callback(err);

        return callback(null, finalPreferences);
      });
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

    if (!valuecallback || typeof value != typeof defaultPreferences[key])
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

// const fs = require('fs/promises');
// const os = require('os');
// const path = require('path');
// const { app } = require('electron');

// const defaultPreferences = {
//   theme: 'dark',
//   sshFolderPath: path.join(os.homedir(), '.ssh')
// };

// const preferencesPath = path.join(app.getPath('userData'), 'preferences.json');
// console.log(app.getPath('userData'))

// const isLocalPreferencesObjectMatchDefaultSchema = preferences => {
//   if (!preferences || typeof preferences != 'object')
//     return false;

//   const preferencesKeys = Object.keys(preferences);
//   const defultKeys = Object.keys(defaultPreferences);

//   if (preferencesKeys.length != defultKeys.length)
//     return false;

//   for (let i = 0; i < defultKeys.length; i++)
//     if (preferencesKeys[i] != defultKeys[i])
//       return false;

//   return true;
// };

// const getLocalPreferences = _ => {
//   // return new Promise((resolve, reject) => {
//   //   let localPreferences = {};

//   //   try {
//   //     localPreferences = require(preferencesPath);
//   //   } catch (err) {
//   //     return reject('not_initialized');
//   //   };

//   //   if (!isLocalPreferencesObjectMatchDefaultSchema(localPreferences))
//   //     return reject('not_initialized');

//   //   return resolve(localPreferences);
//   // });
//   let localPreferences = {};

//   try {
//     localPreferences = require(preferencesPath);
//   } catch (err) {
//     return { err: 'not_initialized' };
//   }

//   if (!isLocalPreferencesObjectMatchDefaultSchema(localPreferences))
//     return { err: 'not_initialized' };

//   return { preferences: localPreferences };
// };

// const Preferences = {
//   init: _ => {
//     // return new Promise((resolve, reject) => {
//     //   getLocalPreferences()
//     //     .then(Preferences.createOrUpdate)
//     //     .then(resolve)
//     //     .catch(reject);
//     // });
//     const { preferences, err } = getLocalPreferences();

//     if (err) return reject(err);

//     return Preferences.createOrUpdate(preferences);
//   },
//   createOrUpdate: preferences => {
//     return new Promise((resolve, reject) => {
//       if (!preferences || typeof preferences != 'object')
//         return reject('bad_request');

//       const fixedPreferences = {};

//       Object.keys(defaultPreferences).forEach(key => {
//         fixedPreferences[key] = preferences[key] || defaultPreferences[key];
//       });

//       fs.writeFile(preferencesPath, JSON.stringify(fixedPreferences, null, 2))
//         .then(_ => resolve(fixedPreferences))
//         .catch(_ => reject('error_writing_file'));
//     });
//   },
//   get: key => {
//     return new Promise((resolve, reject) => {
//       if (!key || typeof key != 'string' || !key.trim() || !defaultPreferences[key])
//         return reject('bad_request');

//       getLocalPreferences()
//         .then(preferences => resolve(preferences[key]))
//         .catch(reject);
//     });
//   },
//   set: (key, value) => {
//     return new Promise((resolve, reject) => {
//       if (!key || typeof key != 'string' || !key.trim() || !defaultPreferences[key])
//         return reject('bad_request');

//       if (!value || typeof value != typeof defaultPreferences[key])
//         return reject('bad_request');

//       getLocalPreferences()
//         .catch(reject)
//         .then(preferences => {
//           preferences[key] = value;

//           return preferences;
//         })
//         .then(preferences => fs.writeFile(preferencesPath, JSON.stringify(preferences, null, 2)))
//         .catch(_ => reject('error_writing_file'))
//         .then(_ => resolve(value));
//     })
//   }
// };

// module.exports = Preferences;