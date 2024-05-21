const makeServerManager = _ => {
  const _checkDocker = callback => {
    localhostRequest('/ssh/docker/check', 'POST', {
      host: window.host,
    }, (err, res) => {
      if (err || res.err)
        return callback(err || res.err);

      return callback(null);
    });
  };

  const _checkServerListenerAndMatchVersion = callback => {
    localhostRequest('/ssh/server-listener/check', 'POST', {
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
    connectWithPassword: (data, onData, callback) => {
      const requestId = onStreamData(onData);

      localhostRequest('/ssh/connection/password', 'POST', {
        host: window.host,
        id: requestId,
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
      _checkDocker(err => {
        if (err && err != 'docker_not_installed' && err != 'docker_not_running')
          return callback(err);

        if (err) {
          const requestId = onStreamData(onData);

          localhostRequest('/ssh/docker/install', 'POST', {
            host: window.host,
            id: requestId
          }, (err, res) => {
            if (err || res.err)
              return callback(err || res.err);

            endStream(requestId);

            return callback(null);
          });

          return requestId;
        };

        return callback('docker_already_installed');
      });
    },
    checkAvailibilityForNodeInstallation: callback => {
      _checkDocker(err => {
        if (err) return callback(err);

        _checkServerListenerAndMatchVersion(err => {
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
    updateServerListener: callback => {
      localhostRequest('/ssh/server-listener/update', 'POST', {
        host: window.host
      }, (err, res) => {
        if (err || res.err)
          return callback(err || res.err);

        return callback(null);
      });
    },
    installServerListener: (onData, callback) => {
      _checkServerListenerAndMatchVersion(err => {
        if (err && err != 'server_listener_not_running')
          return callback(err);

        if (err) {
          const requestId = onStreamData(onData);

          localhostRequest('/ssh/server-listener/install', 'POST', {
            host: window.host,
            id: requestId
          }, (err, res) => {
            if (err || res.err)
              return callback(err || res.err);

            endStream(requestId);

            return callback(null);
          });

          return requestId;
        };

        return callback('server_listener_already_running');
      });
    },
    uninstallServerListener: callback => {
      _checkDocker(err => {
        if (err)
          return callback(err);

        localhostRequest('/ssh/server-listener/uninstall', 'POST', {
          host: window.host
        }, (err, res) => {
          if (err || res.err)
            return callback(err || res.err);

          return callback(null);
        });
      });
    },
    removeRunningNodeInstance: callback => {
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