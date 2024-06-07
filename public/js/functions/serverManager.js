const makeServerManager = _ => {
  const _checkDocker = callback => {
    localhostRequest('/ssh/docker/check', 'POST', {
      host: window.host,
    }, (err, res) => {
      if (err)
        return callback(err);

      return callback(null);
    });
  };

  const _checkServerListenerAndMatchVersion = callback => {
    localhostRequest('/ssh/server-listener/check', 'POST', {
      host: window.host,
    }, (err, res) => {
      if (err)
        return callback(err);

      return callback(null);
    });
  };

  const _checkRunningNodeInstance = callback => {
    localhostRequest('/ssh/node/check', 'POST', {
      host: window.host,
    }, (err, res) => {
      if (err)
        return callback(err);

      return callback(null);
    });
  };

  const _checkAvailableResources = callback => {
    localhostRequest('/ssh/resource/check', 'POST', {
      host: window.host,
    }, (err, res) => {
      if (err)
        return callback(err);

      return callback(null);
    });
  };

  return {
    connectWithPassword: (data, onData, callback) => {
      const stream = makeStream(onData);

      localhostRequest('/ssh/connection/password', 'POST', {
        host: window.host,
        id: stream.id,
        ...data
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    },
    connectWithKey: (data, callback) => {
      localhostRequest('/ssh/connection/key', 'POST', {
        host: window.host,
        ...data
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    },
    disconnect: callback => {
      localhostRequest('/ssh/connection/end', 'POST', {
        host: window.host
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    },
    uninstallDocker: callback => {
      localhostRequest('/ssh/docker/uninstall', 'POST', {
        host: window.host
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    },
    installDocker: (onData, callback) => {
      _checkDocker(err => {
        if (!err)
          return callback('docker_already_installed');

        if (err != 'docker_not_installed' && err != 'docker_not_running')
          return callback(err);

        const stream = makeStream(onData);

        localhostRequest('/ssh/docker/install', 'POST', {
          host: window.host,
          id: stream.id
        }, (err, res) => {
          stream.end();

          if (err)
            return callback(err);

          return callback(null);
        });

        return stream.id;
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
        if (err)
          return callback(err);

        return callback(null);
      });
    },
    installServerListener: (onData, callback) => {
      _checkServerListenerAndMatchVersion(err => {
        if (err && err != 'server_listener_not_running')
          return callback(err);

        if (err) {
          const stream = makeStream(onData);

          localhostRequest('/ssh/server-listener/install', 'POST', {
            host: window.host,
            id: stream.id
          }, (err, res) => {
            stream.end();

            if (err)
              return callback(err);

            return callback(null);
          });

          return stream.id;
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
          if (err)
            return callback(err);

          return callback(null);
        });
      });
    },
  };
};

const serverManager = makeServerManager();