const makeNodeManager = _ => {
  const _replaceScriptPlaceholdersWithChainInfo = (docker_compose_content, chain_info, callback) => {
    if (!docker_compose_content || typeof docker_compose_content != 'string')
      return callback('bad_request');

    if (!chain_info || typeof chain_info != 'object')
      return callback('bad_request');

    docker_compose_content = docker_compose_content
      .replace(/REPO_PLACEHOLDER/g, chain_info.repo)
      .replace(/VERSION_PLACEHOLDER/g, chain_info.version)
      .replace(/CHAIN_ID_PLACEHOLDER/g, chain_info.chain_id)
      .replace(/GENESIS_FILE_PLACEHOLDER/g, chain_info.genesis_file)
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
              dockerfile_content: scripts.dockerfile_content
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
    uninstallRunningNodeInstance: callback => {
      localhostRequest('/ssh/node/uninstall', 'POST', {
        host: window.host
      }, (err, res) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    },
    startNode: callback => {
      return callback(null);
    },
    stopNode: callback => {
      return callback(null);
    },
    restartNode: callback => {
      return callback(null);
    },
    updateNode: callback => {
      return callback(null);
    }
  };
};

const nodeManager = makeNodeManager();