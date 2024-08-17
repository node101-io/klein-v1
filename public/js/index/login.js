function setLoginRightErrorMessage(message) {
  const loginRightErrorElement = document.querySelector('.index-login-right-error');

  loginRightErrorElement.innerText = message;

  if (message) {
    document.querySelector('.index-login-right-button-icon').classList.remove('display-none');
    document.querySelector('.index-login-right-button-loading-icon').classList.add('display-none');

    loginRightErrorElement.classList.remove('display-none');
  } else {
    loginRightErrorElement.classList.add('display-none');
  };
};

function setLoginStyleAsLoading() {
  document.querySelector('.index-login-right-button-icon').classList.add('display-none');
  document.querySelector('.index-login-right-button-loading-icon').classList.remove('display-none');
};

function installNode(callback) {
  serverManager.checkAvailabilityForNodeInstallation((err, res) => {
    if (err == 'docker_not_installed')
      serverManager.installDocker((err, res) => {
        if (err)
          return callback(err);

        return installNode(callback);
      });

    if (err == 'docker_not_running')
      serverManager.uninstallDocker((err, res) => {
        if (err)
          return callback(err);

        serverManager.installDocker((err, res) => {
          if (err)
            return callback(err);

          return installNode(callback);
        });
      });

    if (err == 'server_listener_not_running' || err == 'server_listener_not_running')
      serverManager.uninstallServerListener((err, res) => {
        if (err)
          return callback(err);

        serverManager.installServerListener((err, res) => {
          if (err)
            return callback(err);

          return installNode(callback);
        });
      });

    if (err)
      return callback(err);

    document.querySelector('.index-login-wrapper').classList.add('display-none');
    document.querySelector('.index-installation-wrapper').classList.remove('display-none');

    nodeManager.getInstallationScriptByProject({
      network: 'cosmos',
      project: document.getElementById('index-login-project-identifier').value,
      is_mainnet: false
    }, (err, script) => {
      if (err)
        return callback(err);

      let completedStepCount = 0;

      const progressParts = document.querySelectorAll('.index-installation-progress-each-part');
      const progressText = document.getElementById('index-installation-info-percentage');

//       script.dockerfile_content = `
// ARG GO_VERSION
// FROM golang:$GO_VERSION

// WORKDIR /root

// EXPOSE 26656 26657 1317 9090

// CMD [ "bash" ]`;

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
        // stream.end();

        if (err)
          return callback(err);

        return callback(null);
      });
    });
  });
};

function addServerToSavedServersIfNotExists(data, callback) {
  savedServersManager.getByHost(data.host, (err, saved_server) => {
    if (err && err != 'document_not_found')
      return callback(err);

    if (err)
      savedServersManager.save({
        host: data.host,
        // project_id:
      }, (err, saved_servers) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    else
      return callback(null);
  });
};

window.addEventListener('load', _ => {
  const loginRightIpAddressInput = document.getElementById('index-login-right-ip-address-input');
  const loginRightPasswordInput = document.getElementById('index-login-right-password-input');

  document.addEventListener('click', event => {
    if (event.target.closest('.index-login-right-button-wrapper')) {
      const ipAddress = loginRightIpAddressInput.value;
      const password = loginRightPasswordInput.value;

      setLoginStyleAsLoading();

      serverManager.connect({
        host: ipAddress,
        password: password,
      }, (err, data) => {
        if (err)
          return setLoginRightErrorMessage(err);

        setLoginRightErrorMessage('');

        addServerToSavedServersIfNotExists({
          host: ipAddress.trim()
        }, err => {
          if (err)
            return setLoginRightErrorMessage(err);

          setLoginRightErrorMessage('');

          serverManager.checkAvailabilityForNodeInstallation((err, res) => {
            const queryParams = new URLSearchParams(window.location.search);

            if (queryParams.has('install')) {
              if (err == 'running_node_instance') {
                alert('Another node is already running on this server, please remove it first');
                return window.location.href = '/node';
              };

              installNode((err, res) => {
                if (err)
                  return setLoginRightErrorMessage(err);

                console.log('Node installed successfully');
                return window.location.href = '/node';
              });
            } else {
              if (err == 'running_node_instance')
                return window.location.href = '/node';

              alert('No node is running on this server, please install one first');
              return window.location.href = '/home';
            };
          });
        });
      });
    };

    if (event.target.closest('.index-login-right-remember-me-input')) {
      document.querySelector('.index-login-right-remember-me-icon').classList.toggle('display-none');

      console.log(document.querySelector('.index-login-right-remember-me-input').checked);
    };

    if (event.target.closest('#index-login-right-each-input-visibility-show-button') || event.target.closest('#index-login-right-each-input-visibility-disabled')) {
      document.getElementById('index-login-right-each-input-visibility-disabled').classList.toggle('display-none');

      loginRightPasswordInput.type = loginRightPasswordInput.type == 'password' ? 'text' : 'password';
    };

    if (event.target.closest('.index-login-right-each-input-inner-list-each-item')) {
      const value = event.target.closest('.index-login-right-each-input-inner-list-each-item').id.replace('index-login-right-each-input-list-each-item-', '');

      loginRightIpAddressInput.value = value;

      loginRightPasswordInput.focus();


      // setTimeout(_ => loginRightPasswordInput.focus(), 100);
    };
  });
});