const makePreferenceManager = _ => {
  return {
    get: (key, callback) => {
      localhostRequest(`/preference/get?key=${key}`, 'GET', {}, (err, res) => {
        if (err || res.err)
          return callback(err || res.err);

        return callback(null, res.data);
      });
    },
    set: (key, value, callback) => {
      localhostRequest('/preference/set', 'POST', {
        key: key,
        value: value
      }, (err, res) => {
        if (err || res.err)
          return callback(err || res.err);

        return callback(null, res.data);
      });
    }
  };
};

const preferenceManager = makePreferenceManager();