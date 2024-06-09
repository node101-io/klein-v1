const makeNodeManager = _ => {
  const DOCKERFILE_STEPS_KEYWORDS = [
    'FROM',
    'RUN',
    'CMD',
    'LABEL',
    'MAINTAINER',
    'EXPOSE',
    'ENV',
    'ADD',
    'COPY',
    'ENTRYPOINT',
    'VOLUME',
    'USER',
    'WORKDIR',
    'ARG',
    'ONBUILD',
    'STOPSIGNAL',
    'HEALTHCHECK',
    'SHELL'
  ];
  const DOCKERFILE_STEPS_COUNT_MULTIPLIER = 1.5;

  const _getInstallationStepsCount = dockerfile_content => {
    if (!dockerfile_content || typeof dockerfile_content != 'string')
      return null;

    const steps_count = dockerfile_content
      .split('\n')
      .reduce((acc, line) => {
        if (!line || line.startsWith(' ') || !DOCKERFILE_STEPS_KEYWORDS.includes(line.split(' ')[0]))
          return acc;

        return acc + 1;
      }, 0);

    return steps_count * DOCKERFILE_STEPS_COUNT_MULTIPLIER;
  };

  const _replaceScriptPlaceholdersWithChainInfo = (docker_compose_content, chain_info, callback) => {
    if (!docker_compose_content || typeof docker_compose_content != 'string')
      return callback('bad_request');

    if (!chain_info || typeof chain_info != 'object')
      return callback('bad_request');

    docker_compose_content = docker_compose_content
      .replace(/REPO_PLACEHOLDER/g, chain_info.repo)
      .replace(/VERSION_PLACEHOLDER/g, chain_info.version)
      .replace(/CHAIN_ID_PLACEHOLDER/g, chain_info.chain_id)
      .replace(/GENESIS_FILE_PLACEHOLDER/g, 'https://raw.githubusercontent.com/celestiaorg/networks/master/mocha-4/genesis.json')
      // .replace(/GENESIS_FILE_PLACEHOLDER/g, chain_info.genesis_file)
      .replace(/PEERS_PLACEHOLDER/g, chain_info.peers.join(','))
      .replace(/SEEDS_PLACEHOLDER/g, chain_info.seeds.join(','))
      .replace(/MIN_GAS_PRICES_PLACEHOLDER/g, chain_info.min_gas_price)
      .replace(/DENOM_PLACEHOLDER/g, chain_info.denom)
      .replace(/MONIKER_PLACEHOLDER/g, `klein_node_${Date.now()}`)

    return callback(null, docker_compose_content);
  };

  return {
    getInstallationScriptByProject: (data, callback) => {
      localhostRequest(`/project/script?network=${data.network}&project=${data.project}&is_mainnet=${data.is_mainnet}`, 'GET', {}, (err, scripts) => {
        if (err)
          return callback(err);

        localhostRequest(`/project/info?type=chain_info&network=${data.network}&project=${data.project}&is_mainnet=${data.is_mainnet}`, 'GET', {}, (err, chain_info) => {
          if (err)
            return callback(err);

          _replaceScriptPlaceholdersWithChainInfo(scripts.docker_compose_content, chain_info, (err, new_docker_compose_content) => {
            if (err)
              return callback(err);

            return callback(null, {
              docker_compose_content: new_docker_compose_content,
              dockerfile_content: scripts.dockerfile_content,
              steps_count: _getInstallationStepsCount(scripts.dockerfile_content)
            });
          });
        });
      });
    },
    installNode: (data, onData, callback) => {
      const stream = makeStream(onData);

      if (!data.docker_compose_content || typeof data.docker_compose_content != 'string')
        return callback('bad_request');

      if (!data.dockerfile_content || typeof data.dockerfile_content != 'string')
        return callback('bad_request');

      localhostRequest('/ssh/node/install', 'POST', {
        host: window.host,
        id: stream.id,
        docker_compose_content: data.docker_compose_content,
        dockerfile_content: data.dockerfile_content
      }, (err, res) => {
        stream.end();

        if (err)
          return callback(err);

        return callback(null);
      });

      return stream.id;
    },
    uninstallRunningNode: callback => {
      localhostRequest('/ssh/node/uninstall', 'POST', {
        host: window.host
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    },
    startNode: callback => {
      localhostRequest('/ssh/node/start', 'POST', {
        host: window.host
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    },
    stopNode: callback => {
      localhostRequest('/ssh/node/stop', 'POST', {
        host: window.host
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    },
    restartNode: (data, callback) => {
      localhostRequest(`/project/info?type=chain_info&network=${data.network}&project=${data.project}&is_mainnet=${data.is_mainnet}`, 'GET', {}, (err, chain_info) => {
        if (err)
          return callback(err);

        localhostRequest('/ssh/node/set-peers', 'POST', {
          host: window.host,
          peers: chain_info.peers
        }, (err, res) => {
          if (err)
            return callback(err);

          localhostRequest('/ssh/node/set-seeds', 'POST', {
            host: window.host,
            seeds: chain_info.seeds
          }, (err, res) => {
            if (err)
              return callback(err);

            localhostRequest('/ssh/node/restart', 'POST', {
              host: window.host
            }, (err, res) => {
              if (err)
                return callback(err);

              return callback(null);
            });
          });
        });
      });
    },
    updateNode: callback => {
      // TODO
    },
    checkLogs: (onData, callback) => {
      const stream = makeStream(onData);

      localhostRequest('/ssh/node/logs', 'POST', {
        host: window.host,
        id: stream.id
      }, (err, res) => {
        stream.end();

        if (err)
          return callback(err);

        return callback(null);
      });

      return stream.id;
    }
  };
};

const nodeManager = makeNodeManager();