const makeNodeManager = _ => {
  const replacePlaceholdersInInstallationScript = callback => {
    return callback(null, null);
  };

  return {
    getInstallationScriptByProject: (data, callback) => {
      localhostRequest(`/project/script?network=${data.network}&project=${data.project}&is_mainnet=${data.is_mainnet}`, 'GET', {}, (err, res) => {
        if (err || res.err)
          return callback(err || res.err);

        const docker_compose_content = res.data.docker_compose_content;
        const dockerfile_content = res.data.dockerfile_content;

        localhostRequest(`/project/info?type=chain_info&network=${data.network}&project=${data.project}&is_mainnet=${data.is_mainnet}`, 'GET', {}, (err, res) => {
          if (err || res.err)
            return callback(err || res.err);

          const chain_info = res.data;

          replacePlaceholdersInInstallationScript(docker_compose_content, chain_info, (err, new_docker_compose_content) => {
            if (err)
              return callback(err);

            return callback(null, {
              docker_compose_content: new_docker_compose_content,
              dockerfile_content: dockerfile_content
            });
          });
        });
      });
    },
    installNode: (data, onData, callback) => {
      const stream = makeStream(onData);

      console.log(data);

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

        if (err || res.err)
          return callback(err || res.err);

        return callback(null);
      });

      return stream.id;
    },
    uninstallRunningNodeInstance: callback => {
      localhostRequest('/ssh/node/uninstall', 'POST', {
        host: window.host
      }, (err, res) => {
        if (err || res.err)
          return callback(err || res.err);

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