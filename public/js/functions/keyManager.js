const makeKeyManager = _ => {
  return {
    showKeysLocal: (data, callback) => {
      localhostRequest('/ssh/key/local/show', 'POST', {
        ...data
      }, (err, local_keys) => {
        if (err)
          return callback(err);

        return callback(null, local_keys);
      });
    },
    createKeyLocal: (data, callback) => {
      localhostRequest('/ssh/key/local/create', 'POST', {
        ...data
      }, (err, created_key_path) => {
        if (err)
          return callback(err);

        return callback(null, created_key_path);
      });
    },
    removeKeyLocal: (data, callback) => {
      localhostRequest('/ssh/key/local/remove', 'POST', {
        ...data
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    },
    showKeysRemote: (data, callback) => {
      localhostRequest('/ssh/key/remote/show', 'POST', {
        host: window.host,
        ...data
      }, (err, remote_keys) => {
        if (err)
          return callback(err);

        return callback(null, remote_keys);
      });
    },
    addKeyRemote: (data, callback) => {
      localhostRequest('/ssh/key/remote/add', 'POST', {
        host: window.host,
        ...data
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    },
    removeKeyRemote: (data, callback) => {
      localhostRequest('/ssh/key/remote/remove', 'POST', {
        host: window.host,
        ...data
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    }
  };
};

const keyManager = makeKeyManager();