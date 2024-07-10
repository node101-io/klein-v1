const makeSavedServersManager = _ => {
  return {
    getAll: callback => {
      localhostRequest('/saved-server/get', 'GET', {} , (err, saved_servers) => {
        if (err)
          return callback(err);

        return callback(null, saved_servers);
      });
    },
    getByHost: (host, callback) => {
      localhostRequest(`/saved-server/get?host=${host}`, 'GET', {}, (err, saved_server) => {
        if (err)
          return callback(err);

        return callback(null, saved_server);
      });
    },
    save: (data, callback) => {
      localhostRequest('/saved-server/save', 'POST', {
        server: data
      }, (err, saved_servers) => {
        if (err)
          return callback(err);

        return callback(null, saved_servers);
      });
    },
    deleteByHost: (host, callback) => {
      localhostRequest('/saved-server/delete', 'GET', {
        host: host
      }, (err, saved_servers) => {
        if (err)
          return callback(err);

        return callback(null, saved_servers);
      });
    }
  };
};

const savedServersManager = makeSavedServersManager();