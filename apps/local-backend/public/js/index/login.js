function loadPageIndexLogin(data) {
  loadingStart();

  if (data.index_login_server_host)
    document.getElementById('index-login-right-ip-address-input').value = data.index_login_server_host;

  localhostRequest('/login', 'POST', {
    project_id: data.index_login_project_id
  }, (err, project) => {
    if (err) window.location = '/home';

    localhostRequest('/templates/index-login-project-wrapper', 'POST', {
      project: project,
      will_install: data.index_login_will_install
    }, (err, html) => {
      if (err) window.location = '/home';

      document.querySelector('.index-login-left-inner-wrapper').innerHTML = html;

      localhostRequest('/templates/index-login-right-button-wrapper', 'POST', {
        will_install: data.index_login_will_install
      }, (err, html) => {
        if (err) window.location = '/home';

        document.querySelector('.index-login-right-button-outer-wrapper').innerHTML = html;

        loadingStop();
      });
    });
  });
};

function setLoginRightErrorMessage(message) {
  const loginRightErrorElement = document.querySelector('.index-login-right-error');

  loginRightErrorElement.innerText = message;
  loginRightErrorElement.classList.toggle('display-none', !message);
};

function addServerToSavedServersIfNotExists(data, callback) {
  if (!data.is_checkbox_checked)
    return callback(null);

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
      loadingStart();

      const ipAddress = loginRightIpAddressInput.value.trim();
      const password = loginRightPasswordInput.value;

      serverManager.connect({
        host: ipAddress,
        password: password,
      }, (err, data) => {
        if (err)
          return setLoginRightErrorMessage(err);

        addServerToSavedServersIfNotExists({
          is_checkbox_checked: document.querySelector('.index-login-right-remember-me-input').checked,
          host: ipAddress
        }, err => {
          if (err)
            return setLoginRightErrorMessage(err);

          localhostRequest('/session/get', 'POST', {
            keys: ['index_login_will_install']
          }, (err, session) => {
            if (err)
              return console.error(err);

            if (session.index_login_will_install) {
              serverManager.isAnyNodeInstanceRunning((err, is_node_instance_running) => {
                if (err)
                  return setLoginRightErrorMessage(err);

                if (!is_node_instance_running) // start installation
                  return navigatePage('/install');

                serverManager.getServerReadyForNodeManagement((err, res) => {
                  if (err)
                    return setLoginRightErrorMessage(err);

                  console.log('go to node and delete it first'); // TODO: add information dialog

                  return navigatePage('/node');
                });
              });
            } else {
              serverManager.isAnyNodeInstanceRunning((err, is_node_instance_running) => {
                if (err)
                  return setLoginRightErrorMessage(err);

                if (!is_node_instance_running) {
                  console.log('go choose a node to install'); // TODO: add information dialog

                  return navigatePage('/home');
                };

                serverManager.getServerReadyForNodeManagement((err, res) => {
                  if (err)
                    return setLoginRightErrorMessage(err);

                  return navigatePage('/node');
                });
              });
            };
          });
        });
      });
    };

    if (event.target.closest('.index-login-right-remember-me-input')) {
      document.querySelector('.index-login-right-remember-me-icon').classList.toggle('display-none');
    };

    if (event.target.closest('#index-login-right-each-input-visibility-show-button') || event.target.closest('#index-login-right-each-input-visibility-disabled')) {
      document.getElementById('index-login-right-each-input-visibility-disabled').classList.toggle('display-none');

      loginRightPasswordInput.type = loginRightPasswordInput.type == 'password' ? 'text' : 'password';
    };

    if (event.target.closest('.index-login-right-each-input-inner-list-each-item')) {
      loginRightIpAddressInput.value = event.target.closest('.index-login-right-each-input-inner-list-each-item').id.replace('index-login-right-each-input-list-each-item-', '');;

      loginRightPasswordInput.focus();
    };
  });
});
