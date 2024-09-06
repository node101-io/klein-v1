function loadPageIndexInstallation(data) {
  loadingStart();

  localhostRequest('/session/get', 'POST', {
    keys: ['global_current_project']
  }, (err, session) => {
    if (err) window.location = '/home';

    localhostRequest('/templates/index-installation-project-wrapper', 'POST', {
      project: session.global_current_project
    }, (err, html) => {
      if (err) window.location = '/home';

      document.querySelector('.index-installation-project-outer-wrapper').innerHTML = html;

      loadingStop();

      installNode((err, res) => {
        if (err)
          return console.error(err);

        return navigatePage('/node');
      });
    });
  });
};

function installNode(callback) {
  serverManager.getServerReadyForNodeInstallation((err, res) => {
    if (err)
      return callback(err);

    localhostRequest('/session/get', 'POST', {
      keys: ['global_current_project']
    }, (err, session) => {
      if (err) window.location = '/home';

      nodeManager.getInstallationScriptByProject({
        network: 'cosmos',
        project: session.global_current_project.chain_registry_identifier,
        is_mainnet: false
      }, (err, script) => {
        if (err)
          return callback(err);

        let completedStepCount = 0;

        const progressParts = document.querySelectorAll('.index-installation-progress-each-part');
        const progressText = document.getElementById('index-installation-info-percentage');

        script.dockerfile_content = `
          ARG GO_VERSION
          FROM golang:$GO_VERSION

          WORKDIR /root

          EXPOSE 26656 26657 1317 9090

          CMD [ "bash" ]`;

        const stream = nodeManager.installNode({
          docker_compose_content: script.docker_compose_content,
          dockerfile_content: script.dockerfile_content,
          project_route: script.project_route
        }, data => {
          const eachBuildLog = jsonify(data.data);

          if (eachBuildLog && eachBuildLog.vertexes && Array.isArray(eachBuildLog.vertexes) && eachBuildLog.vertexes.length > 0 && eachBuildLog.vertexes.find(vertex => vertex.completed)) {
            completedStepCount++;

            const percentage = Math.floor(completedStepCount * 100 / script.steps_count);

            progressText.innerText = progressText.innerText.startsWith('%') ? `%${percentage}` : `${percentage}%`;

            for (let i = 0; i < percentage; i++)
              progressParts[i].classList.add('index-installation-progress-each-part-colored');
          };

          console.log(`Progress: ${Math.floor(completedStepCount * 100 / script.steps_count)}%`, eachBuildLog);
        }, (err, res) => {
          stream.end();

          if (err)
            return callback(err);

          return callback(null);
        });
      });
    });
  });
};

window.addEventListener('load', _ => {
  console.log('install.js loaded');
});
