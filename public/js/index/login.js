const setLoginRightErrorMessage = message => {
  const loginRightErrorElement = document.querySelector('.index-login-right-error');

  loginRightErrorElement.innerText = message;

  if (message)
    loginRightErrorElement.classList.remove('display-none');
  else
    loginRightErrorElement.classList.add('display-none');
};

window.addEventListener('load', _ => {
  const loginRightErrorElement = document.querySelector('.index-login-right-error');

  document.addEventListener('click', event => {
    if (event.target.closest('.index-login-right-button-wrapper')) {
      const ipAddress = document.getElementById('index-login-right-ip-address-input').value;
      const password = document.getElementById('index-login-right-password-input').value;

      const stream = serverManager.connect({
        host: ipAddress,
        password: password,
      }, data => {
        console.log(data);

        if (data.type == 'ready') {
          setLoginRightErrorMessage('');

          const queryParams = new URLSearchParams(window.location.search);

          if (queryParams.get('install')) {
            // start installation
            serverManager.checkAvailabilityForNodeInstallation((err, res) => {
              if (err)
                return console.error(err);

              // const stream = nodeManager.installNode({
              //   docker_compose_content: res.docker_compose_content,
              //   dockerfile_content: res.dockerfile_content,
              //   project_route: res.project_route
              // }, data => {
              //   const eachBuildLog = jsonify(data.data);

              //   if (eachBuildLog && eachBuildLog.vertexes && Array.isArray(eachBuildLog.vertexes) && eachBuildLog.vertexes.length > 0 && eachBuildLog.vertexes.find(vertex => vertex.completed))
              //     completedStepCount++;

              //   console.log(`Progress: ${Math.floor(completedStepCount * 100 / res.steps_count)}%`, eachBuildLog);
              // }, (err, res) => {
              //   stream.end();

              //   if (err)
              //     return console.error(err);

              //   return console.log(res);
              // });
            });
          } else {
            window.location.href = '/node?lang=tr';
          };
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