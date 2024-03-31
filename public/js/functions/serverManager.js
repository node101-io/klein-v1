const makeServerManager = () => {
  const _checkDocker = callback => {
    localhostRequest('/ssh/docker/check', 'POST', {
      host: window.host,
    }, (err, res) => {
      if (err || res.err)
        return callback(err || res.err);

      return callback(null);
    });
  };

  const _checkNodeListenerAndMatchVersion = callback => {
    localhostRequest('/ssh/node-listener/check', 'POST', {
      host: window.host,
    }, (err, res) => {
      if (err || res.err)
        return callback(err || res.err);

      return callback(null);
    });
  };

  const _checkRunningNodeInstance = callback => {
    localhostRequest('/ssh/node/check', 'POST', {
      host: window.host,
    }, (err, res) => {
      if (err || res.err)
        return callback(err || res.err);

      return callback(null);
    });
  };

  const _checkAvailableResources = callback => {
    localhostRequest('/ssh/resource/check', 'POST', {
      host: window.host,
    }, (err, res) => {
      if (err || res.err)
        return callback(err || res.err);

      return callback(null);
    });
  };

  return {
    connectWithPassword: (data, callback) => {
      localhostRequest('/ssh/connection/password', 'POST', {
        host: window.host,
        ...data
      }, (err, res) => {
        if (err || res.err)
          return callback(err || res.err);

        return callback(null);
      });
    },
    connectWithKey: (data, callback) => {
      localhostRequest('/ssh/connection/key', 'POST', {
        host: window.host,
        ...data
      }, (err, res) => {
        if (err || res.err)
          return callback(err || res.err);

        return callback(null, res.data);
      });
    },
    disconnect: callback => {
      localhostRequest('/ssh/connection/end', 'POST', {
        host: window.host
      }, (err, res) => {
        if (err || res.err)
          return callback(err || res.err);

        return callback(null, res.data);
      });
    },
    uninstallDocker: callback => {
      localhostRequest('/ssh/docker/uninstall', 'POST', {
        host: window.host
      }, (err, res) => {
        if (err || res.err)
          return callback(err || res.err);

        return callback(null);
      });
    },
    installDocker: (onData, callback) => {
      const requestId = onStreamData(onData);

      localhostRequest('/ssh/docker/install', 'POST', {
        host: window.host,
        id: requestId
      }, (err, res) => {
        if (err || res.err)
          return callback(err || res.err);

        endStream(requestId);

        return callback(null, res.data);
      });

      return requestId;
    },
    checkAvailibilityForNodeInstallation: callback => {
      _checkDocker(err => {
        if (err) return callback(err);

        _checkNodeListenerAndMatchVersion(err => {
          if (err) return callback(err);

          _checkRunningNodeInstance(err => {
            if (err) return callback(err);

            _checkAvailableResources(err => {
              if (err) return callback(err);

              return callback(null);
            });
          });
        });
      });
    },
    updateNodeListener: callback => {
      localhostRequest('/ssh/node-listener/update', 'POST', {
        host: window.host
      }, (err, res) => {
        if (err || res.err)
          return callback(err || res.err);

        return callback(null);
      });
    },
    installNodeListener: function (callback) {
      localhostRequest('/ssh/node-listener/install', 'POST', {
        host: window.host
      }, (err, res) => {
        if (err || res.err)
          return callback(err || res.err);

        return callback(null);
      });
    },
    uninstallNodeListener: function (callback) {
      localhostRequest('/ssh/node-listener/uninstall', 'POST', {
        host: window.host
      }, (err, res) => {
        if (err || res.err)
          return callback(err || res.err);

        return callback(null);
      });
    },
    removeRunningNodeInstance: function(callback) {
      localhostRequest('/ssh/node/remove', 'POST', {
        host: window.host
      }, (err, res) => {
        if (err || res.err)
          return callback(err || res.err);

        return callback(null);
      });
    }
  };
};

const serverManager = makeServerManager();