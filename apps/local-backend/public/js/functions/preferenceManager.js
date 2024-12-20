const makePreferenceManager = _ => {
  return {
    get: (key, callback) => {
      localhostRequest(`/preference/get?key=${key}`, 'GET', {}, (err, value) => {
        if (err)
          return callback(err);

        return callback(null, value);
      });
    },
    set: (key, value, callback) => {
      localhostRequest('/preference/set', 'POST', {
        key: key,
        value: value
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    }
  };
};

const preferenceManager = makePreferenceManager();