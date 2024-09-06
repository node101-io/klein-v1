const makeServerManager = _ => {
  const _checkDocker = callback => {
    localhostRequest('/ssh/docker/check', 'POST', {}, (err, res) => {
      if (err)
        return callback(err);

      return callback(null);
    });
  };

  const _checkServerListenerAndMatchVersion = callback => {
    localhostRequest('/ssh/server-listener/check', 'POST', {}, (err, res) => {
      if (err)
        return callback(err);

      return callback(null);
    });
  };

  const _checkRunningNodeInstance = callback => {
    localhostRequest('/ssh/node/check', 'POST', {}, (err, res) => {
      if (err)
        return callback(err);

      return callback(null);
    });
  };

  const _checkAvailableResources = callback => {
    localhostRequest('/ssh/server-listener/stats', 'POST', {}, (err, res) => {
      if (err)
        return callback(err);

      return callback(null);
    });
  };

  const _installServerListener = callback => {
    localhostRequest('/ssh/server-listener/install', 'POST', {}, (err, res) => {
      if (err)
        return callback(err);

      return callback(null);
    });
  };

  const _uninstallServerListener = callback => {
    _checkDocker(err => {
      if (err)
        return callback(err);

      localhostRequest('/ssh/server-listener/uninstall', 'POST', {}, (err, res) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    });
  };

  const _uninstallServerListenerIfInstalled = callback => {
    _checkDocker(err => {
      if (err)
        return callback(null);

      _checkServerListenerAndMatchVersion(err => {
        if (err == 'server_listener_not_exist')
          return callback(null);

        _uninstallServerListener(err => {
          if (err)
            return callback(err);

          return callback(null);
        });
      });
    });
  };

  const _installDocker = callback => {
    localhostRequest('/ssh/docker/install', 'POST', {}, (err, res) => {
      if (err)
        return callback(err);

      return callback(null);
    });
  };

  const _uninstallDocker = callback => {
    localhostRequest('/ssh/docker/uninstall', 'POST', {}, (err, res) => {
      if (err)
        return callback(err);

      return callback(null);
    });
  };

  const _installDockerIfNotInstalled = callback => {
    _checkDocker(err => {
      if (err == 'docker_not_installed')
        return _installDocker(callback);

      if (err == 'docker_not_running')
        return _uninstallDocker(err => {
          if (err)
            return callback(err);

          return _installDocker(callback);
        });

      return callback(null);
    });
  };

  const _installOrUpdateServerListenerIfDoesntExistOrOutdated = callback => {
    _checkServerListenerAndMatchVersion(err => {
      if (err == 'server_listener_not_exist')
        return _installServerListener(callback);

      if (err == 'server_listener_not_running')
        return _uninstallServerListenerIfInstalled(err => {
          if (err)
            return callback(err);

          return _installServerListener(callback);
        });

      if (err == 'server_listener_version_mismatch')
        return _uninstallServerListenerIfInstalled(err => {
          if (err)
            return callback(err);

          return _installServerListener(callback);
        });

      if (err)
        return callback(err);

      return callback(null);
    });
  };

  const _isAnyNodeInstanceRunning = callback => {
    _checkDocker(err => {
      if (err)
        return callback(null, false);

      _checkRunningNodeInstance(err => {
        if (err)
          return callback(null, true);

        return callback(null, false);
      });
    });
  };

  const _isEnoughResourcesAvailableForNodeInstallation = callback => {
    localhostRequest('/ssh/server-listener/stats', 'POST', {}, (err, res) => {
      if (err)
        return callback(null, false);

      return callback(null, true);
    });
  };

  return {
    connect: (data, callback) => {
      localhostRequest('/ssh/connection/start', 'POST', {
        ...data
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    },
    disconnect: callback => {
      localhostRequest('/ssh/connection/end', 'POST', {}, (err, res) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    },
    getServerReadyForNodeInstallation: callback => {
      _installDockerIfNotInstalled(err => {
        if (err) return callback(err);

        _installOrUpdateServerListenerIfDoesntExistOrOutdated(err => {
          if (err) return callback(err);

          _isAnyNodeInstanceRunning((err, is_node_instance_running) => {
            if (err) return callback(err);

            if (is_node_instance_running)
              return callback('node_instance_already_running');

            _isEnoughResourcesAvailableForNodeInstallation((err, is_enough_resources_available) => {
              if (err) return callback(err);

              if (!is_enough_resources_available)
                return callback('not_enough_resources_available');

              return callback(null);
            });
          });
        });
      });
    },
    getServerReadyForNodeManagement: callback => {
      _installOrUpdateServerListenerIfDoesntExistOrOutdated(err => {
        if (err) return callback(err);

        return callback(null);
      });
    },
    isAnyNodeInstanceRunning: _isAnyNodeInstanceRunning,
  };
};

const serverManager = makeServerManager();
