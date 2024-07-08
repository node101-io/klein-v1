function setLoginRightErrorMessage(message) {
  const loginRightErrorElement = document.querySelector('.index-login-right-error');

  loginRightErrorElement.innerText = message;

  if (message)
    loginRightErrorElement.classList.remove('display-none');
  else
    loginRightErrorElement.classList.add('display-none');
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

      const stream = nodeManager.installNode({
        docker_compose_content: script.docker_compose_content,
        dockerfile_content: script.dockerfile_content,
        project_route: script.project_route
      }, data => {
        const eachBuildLog = jsonify(data.data);

        if (eachBuildLog && eachBuildLog.vertexes && Array.isArray(eachBuildLog.vertexes) && eachBuildLog.vertexes.length > 0 && eachBuildLog.vertexes.find(vertex => vertex.completed)) {
          completedStepCount++;

          for (let i = 0; i < Math.floor(completedStepCount * 100 / script.steps_count); i++)
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
};

window.addEventListener('load', _ => {
  document.addEventListener('click', event => {
    if (event.target.closest('.index-login-right-button-wrapper')) {
      const ipAddress = document.getElementById('index-login-right-ip-address-input').value;
      const password = document.getElementById('index-login-right-password-input').value;

      const stream = serverManager.connect({
        host: ipAddress,
        password: password,
      }, data => {
        console.log(data.type);

        if (data.type == 'ready') {
          window.host = ipAddress.trim();

          setLoginRightErrorMessage('');

          const queryParams = new URLSearchParams(window.location.search);

          serverManager.checkAvailabilityForNodeInstallation((err, res) => {
            if (queryParams.get('install')) {
              if (err == 'running_node_instance') {
                alert('Another node is already running on this server, please remove it first');
                return window.location.href = '/node?lang=tr';
              };

              installNode((err, res) => {
                if (err)
                  return setLoginRightErrorMessage(err);

                console.log('Node installed successfully');
                window.location.href = '/node?lang=tr';
              });
            } else {
              if (err == 'running_node_instance')
                return window.location.href = '/node?lang=tr';

              alert('No node is running on this server, please install one first');
              return window.location.href = '/home?lang=tr';
            };
          });
        };

        if (data.type == 'change_password') {
          stream.end();

          setLoginRightErrorMessage('Please change your password');
        };

        if (data.type == 'authentication_failed') {
          stream.end();

          setLoginRightErrorMessage('Authentication failed');
        };

        if (data.type == 'network_error') {
          stream.end();

          if (window.location.pathname == '/login') {
            setLoginRightErrorMessage('Network error, please try again');
          } else {
            alert('Network error, please try again');
            window.location.href = '/login';
          };
        };

        if (data.type == 'client_timeout') {
          stream.end();

          setLoginRightErrorMessage('Server did not respond in time, please try again');
        };

        if (data.type == 'timed_out') {
          stream.end();

          if (window.location.pathname == '/login') {
            setLoginRightErrorMessage('Server timed out, please try again');
          } else {
            alert('Server timed out, please try again');
            window.location.href = '/login';
          };
        };

        if (data.type == 'unknown_error') {
          stream.end();

          if (window.location.pathname == '/login') {
            setLoginRightErrorMessage('Unknown error, please try again');
          } else {
            alert('Unknown error, please try again');
            window.location.href = '/login';
          };
        };
      }, (err, data) => {
        if (err)
          return console.error(err);

        console.log(data);
      });
    };

    if (event.target.closest('.index-login-right-remember-me-input')) {
      document.querySelector('.index-login-right-remember-me-icon').classList.toggle('display-none');

      console.log(document.querySelector('.index-login-right-remember-me-input').checked);
    };
  });
});