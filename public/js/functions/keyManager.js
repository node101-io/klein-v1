const makeKeyManager = () => {
  return {
    showKeysLocal: (data, callback) => {
      localhostRequest('/ssh/key/local/show', 'POST', {
        ...data
      }, (err, res) => {
        if (err || res.err)
          return callback(err || res.err);

        return callback(null, res.data);
      });
    },
    createKeyLocal: (data, callback) => {
      localhostRequest('/ssh/key/local/create', 'POST', {
        ...data
      }, (err, res) => {
        if (err || res.err)
          return callback(err || res.err);

        return callback(null, res.data);
      });
    },
    removeKeyLocal: (data, callback) => {
      localhostRequest('/ssh/key/local/remove', 'POST', {
        ...data
      }, (err, res) => {
        if (err || res.err)
          return callback(err || res.err);

        return callback(null, res.data);
      });
    },
    showKeysRemote: (data, callback) => {
      localhostRequest('/ssh/key/remote/show', 'POST', {
        host: window.host,
        ...data
      }, (err, res) => {
        if (err || res.err)
          return callback(err || res.err);

        return callback(null, res.data);
      });
    },
    addKeyRemote: (data, callback) => {
      localhostRequest('/ssh/key/remote/add', 'POST', {
        host: window.host,
        ...data
      }, (err, res) => {
        if (err || res.err)
          return callback(err || res.err);

        return callback(null, res.data);
      });
    },
    removeKeyRemote: (data, callback) => {
      localhostRequest('/ssh/key/remote/remove', 'POST', {
        host: window.host,
        ...data
      }, (err, res) => {
        if (err || res.err)
          return callback(err || res.err);

        return callback(null, res.data);
      });
    }
  };
};

const keyManager = makeKeyManager();