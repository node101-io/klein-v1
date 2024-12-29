const sshRequest = require('./sshRequest');

const SavedServers = require('../utils/saved-servers');

const checkDockerExistentCommand = require('../commands/docker/checkExistent');
const checkDockerSetupCommand = require('../commands/docker/checkSetup');

const checkServerListenerExistentCommand = require('../commands/server-listener/checkExistent');
const getDockerContainerListCommand = require('../commands/docker/getContainerList');

const installServerListenerCommand = require('../commands/server-listener/install');
const uninstallServerListenerCommand = require('../commands/server-listener/uninstall');

const installDockerCommand = require('../commands/docker/install');
const uninstallDockerCommand = require('../commands/docker/uninstall');

const getServerStatsCommand = require('../commands/server-listener/getServerStats');

const jsonify = require('./jsonify');

const versions = require('../versions.json');

const NO_SUCH_FILE_OR_DIRECTORY_MESSAGE_REGEX = /No such file or directory/;
const MAX_CPU_USAGE_PERCENTAGE = 50;
const MAX_MEMORY_USAGE_PERCENTAGE = 80;
const MAX_DISK_USAGE_PERCENTAGE = 60;

const checkDocker = (host, callback) => {
  sshRequest('exec', {
    host: host,
    command: checkDockerExistentCommand()
  }, (err, check_docker_existent_response) => {
    if (err)
      return callback(err);

    if (!check_docker_existent_response.stdout || check_docker_existent_response.stdout != '0')
      return callback('docker_not_installed');

    sshRequest('exec', {
      host: host,
      command: checkDockerSetupCommand()
    }, (err, check_docker_setup_response) => {
      if (err)
        return callback(err);

      if (!check_docker_setup_response.stdout || check_docker_setup_response.stdout != 'active')
        return callback('docker_not_running');

      return callback(null);
    });
  });
};
const checkServerListenerAndMatchVersion = (host, callback) => {
  sshRequest('exec', {
    host: host,
    command: getDockerContainerListCommand()
  }, (err, get_container_list_response) => {
    if (err)
      return callback(err);

    if (!get_container_list_response.stdout || !get_container_list_response.stdout.includes('klein-server-listener'))
      return callback('server_listener_not_exist');

    sshRequest('exec', {
      host: host,
      command: checkServerListenerExistentCommand()
    }, (err, check_server_listener_response) => {
      if (err)
        return callback(err);

      check_server_listener_response.stdout = jsonify(check_server_listener_response.stdout);

      if (!check_server_listener_response.stdout || check_server_listener_response.stdout.status != 'ok')
        return callback('server_listener_not_running');

      sshRequest('sftp:read_file', {
        host: host,
        path: 'server-listener/package.json' // TODO: instead of looking at package.json, we should fetch the tag
      }, (err, package_json) => {
        if (err)
          return callback(err);

        package_json = jsonify(package_json);

        if (!package_json || package_json.version != versions.serverListener)
          return callback('server_listener_version_mismatch');

        return callback({});
      });
    });
  });
};
const checkRunningNodeInstance = (host, callback) => {
  sshRequest('exec', {
    host: host,
    command: getDockerContainerListCommand()
  }, (err, get_container_list_response) => {
    if (err)
      return callback(err);

    if (get_container_list_response.stdout && get_container_list_response.stdout.includes('klein-node'))
      return callback('running_node_instance');

    return callback(null, get_container_list_response.stdout);
  });
};
const createFolderIfNotExists = (host, path, callback) => {
  sshRequest('sftp:exists', {
    host: host,
    path: path
  }, (err, data) => {
    if (err && err != 'document_not_found')
      return callback(err);

    if (!err)
      return callback(null);

    sshRequest('sftp:mkdir', {
      host: host,
      path: path
    }, (err, data) => {
      if (err)
        return callback(err);

      return callback(null);
    });
  });
};
const installServerListener = (host, callback) => {
  createFolderIfNotExists(host, 'klein-node-volume', err => {
    if (err)
      return callback(err);

    sshRequest('exec', {
      host: host,
      command: installServerListenerCommand(versions.serverListener)
    }, (err, install_server_listener_response) => {
      if (err)
        return callback(err);

      return callback(null, install_server_listener_response.stdout);
    });
  });
};
const uninstallServerListener = (host, callback) => {
  checkDocker(err => {
    if (err)
      return callback(err);

    sshRequest('exec', {
      host: host,
      command: uninstallServerListenerCommand()
    }, (err, uninstall_server_listener_response) => {
      if (err)
        return callback(err);

      if (uninstall_server_listener_response.stderr && uninstall_server_listener_response.stderr.includes('Removed'))
        return callback(null);

      if (uninstall_server_listener_response.stderr && uninstall_server_listener_response.code == 1 && NO_SUCH_FILE_OR_DIRECTORY_MESSAGE_REGEX.test(uninstall_server_listener_response.stderr))
        return callback(null);

      return callback('unknown_error');
    });
  });
};
const uninstallServerListenerIfInstalled = (host, callback) => {
  checkDocker(host, err => {
    if (err)
      return callback(null);

    checkServerListenerAndMatchVersion(host, err => {
      if (err == 'server_listener_not_exist')
        return callback(null);

      uninstallServerListener(host, err => {
        if (err)
          return callback(err);

        return callback(null);
      });
    });
  });
};
const installDocker = (host, callback) => {
  sshRequest('exec', {
    host: host,
    command: installDockerCommand()
  }, (err, install_docker_response) => {
    if (err)
      return callback(err);

    return callback(null, install_docker_response.stdout);
  });
};
const uninstallDocker = (host, callback) => {
  sshRequest('exec', {
    host: host,
    command: uninstallDockerCommand()
  }, (err, uninstall_docker_response) => {
    if (err)
      return callback(err);

    return callback(null, uninstall_docker_response.stdout);
  });
};
const installDockerIfNotInstalled = (host, callback) => {
  checkDocker(host, err => {
    if (err == 'docker_not_installed')
      return installDocker(callback);

    if (err == 'docker_not_running')
      return uninstallDocker(host, err => {
        if (err)
          return callback(err);

        return installDocker(host, callback);
      });

    return callback(null);
  });
};
const installOrUpdateServerListenerIfDoesntExistOrOutdated = (host, callback) => {
  checkServerListenerAndMatchVersion(host, err => {
    if (!err)
      return callback(null);

    if (err == 'server_listener_not_exist')
      return installServerListener(host, callback);

    if (err == 'server_listener_not_running')
      return uninstallServerListenerIfInstalled(host, err => {
        if (err)
          return callback(err);

        return installServerListener(host, callback);
      });

    if (err == 'server_listener_version_mismatch')
      return uninstallServerListenerIfInstalled(host, err => {
        if (err)
          return callback(err);

        return installServerListener(host, callback);
      });

    return callback(err);
  });
};
const isAnyNodeInstanceRunning = (host, callback) => {
  checkDocker(host, err => {
    if (err)
      return callback(null, false);

    checkRunningNodeInstance(host, err => {
      if (err)
        return callback(null, true);

      return callback(null, false);
    });
  });
};
const getServerStats = (host, callback) => {
  sshRequest('exec', {
    host: host,
    command: getServerStatsCommand()
  }, (err, check_server_stats_response) => {
    if (err)
      return callback(err);

    check_server_stats_response.stdout = jsonify(check_server_stats_response.stdout);

    if (!check_server_stats_response.stdout)
      return callback('server_stats_error');

    if (!check_server_stats_response.stdout.memory || !check_server_stats_response.stdout.memory.total || !check_server_stats_response.stdout.memory.used || !check_server_stats_response.stdout.memory.available)
      return callback('server_stats_error');

    if (!check_server_stats_response.stdout.cpu || !check_server_stats_response.stdout.cpu.average_used || !check_server_stats_response.stdout.cpu.cores)
      return callback('server_stats_error');

    if (!check_server_stats_response.stdout.disk || !check_server_stats_response.stdout.disk.total || !check_server_stats_response.stdout.disk.used || !check_server_stats_response.stdout.disk.available)
      return callback('server_stats_error');

    check_server_stats_response.stdout.cpu.average_used = parseFloat(check_server_stats_response.stdout.cpu.average_used);
    check_server_stats_response.stdout.memory.used = parseFloat(check_server_stats_response.stdout.memory.used);
    check_server_stats_response.stdout.memory.total = parseFloat(check_server_stats_response.stdout.memory.total);
    check_server_stats_response.stdout.disk.used = parseFloat(check_server_stats_response.stdout.disk.used);
    check_server_stats_response.stdout.disk.total = parseFloat(check_server_stats_response.stdout.disk.total);

    const isCpuUsageHigh = check_server_stats_response.stdout.cpu.average_used > MAX_CPU_USAGE_PERCENTAGE;
    const isMemoryUsageHigh = check_server_stats_response.stdout.memory.used / check_server_stats_response.stdout.memory.total * 100 > MAX_MEMORY_USAGE_PERCENTAGE;
    const isDiskUsageHigh = check_server_stats_response.stdout.disk.used / check_server_stats_response.stdout.disk.total * 100 > MAX_DISK_USAGE_PERCENTAGE;

    return callback(null, {
      is_any_stat_high: isCpuUsageHigh || isMemoryUsageHigh || isDiskUsageHigh,
      cpu: {
        ...check_server_stats_response.stdout.cpu,
        is_high: isCpuUsageHigh
      },
      memory: {
        ...check_server_stats_response.stdout.memory,
        is_high: isMemoryUsageHigh
      },
      disk: {
        ...check_server_stats_response.stdout.disk,
        is_high: isDiskUsageHigh
      },
    });
  });
};
const isEnoughResourcesAvailableForNodeInstallation = (host, callback) => {
  getServerStats(host, (err, stats) => {
    if (err || stats.is_any_stat_high)
      return callback(null, false);

    return callback(null, true);
  });
};
const saveServerIfProvided = (server, callback) => {
  if (!server)
    return callback(null);

  SavedServers.saveIfNotExist(server, (err, saved_servers) => {
    if (err)
      return callback(err);

    return callback(null, saved_servers);
  });
};
const getServerReadyForNodeManagement = (host, callback) => {
  installOrUpdateServerListenerIfDoesntExistOrOutdated(host, err => {
    if (err) return callback(err);

    return callback(null);
  });
};

module.exports = {
  connect: (data, callback) => {
    sshRequest('connect', data, (err) => {
      if (err) return callback(err);

      saveServerIfProvided(data.server, (err) => {
        if (err)
          return callback(err);

        if (data.will_install) {
          isAnyNodeInstanceRunning(data.host, (err, is_node_instance_running) => {
            if (err)
              return callback(err);

            if (!is_node_instance_running) // start installation
              return callback(null, 'install_node');

            getServerReadyForNodeManagement(data.host, (err, res) => {
              if (err)
                return callback(err);

              return callback(null, 'manage_node'); // NOTE: go to node and delete it first
            });
          });
        } else {
          isAnyNodeInstanceRunning(data.host, (err, is_node_instance_running) => {
            if (err)
              return callback(err);

            if (!is_node_instance_running) {
              console.log('go choose a node to install');

              return callback(null, 'choose_node'); // NOTE: go choose a node to install
            };

            getServerReadyForNodeManagement(data.host, (err, res) => {
              if (err)
                return setLoginRightErrorMessage(err);

              return callback(null, 'manage_node');
            });
          });
        };
      });
    });
  },
  checkConnection: (host, callback) => {
    if (!host)
      return callback('no_host_provided');

    sshRequest('check_connection', {
      host: host
    }, (err, is_connected) => {
      if (err) return callback(err);

      return callback(null, is_connected);
    });
  },
  disconnect: (host, callback) => {
    sshRequest('disconnect', {
      host: host
    }, (err) => {
      if (err) return callback(err);

      return callback(null);
    });
  },
  getServerReadyForNodeInstallation: (host, callback) => {
    installDockerIfNotInstalled(host, err => {
      if (err) return callback(err);

      installOrUpdateServerListenerIfDoesntExistOrOutdated(host, err => {
        if (err) return callback(err);

        isAnyNodeInstanceRunning(host, (err, is_node_instance_running) => {
          if (err) return callback(err);

          if (is_node_instance_running)
            return callback('node_instance_already_running');

          isEnoughResourcesAvailableForNodeInstallation(host, (err, is_enough_resources_available) => {
            if (err) return callback(err);

            if (!is_enough_resources_available)
              return callback('not_enough_resources_available');

            return callback(null);
          });
        });
      });
    });
  },
};
