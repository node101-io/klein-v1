window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.closest('#login-button')) {
      serverRequest('/ssh', 'POST', {
        type: 'connect',
        host: '144.91.93.154',
        password: 'foo'
      }, response => {
        if (response.success) {
          console.log('Connected to server');
        } else {
          console.error(response.error);
        };
      });
    };

    if (event.target.closest('#logout-button')) {
      serverRequest('/ssh', 'POST', {
        type: 'disconnect'
      }, response => {
        if (response.success) {
          console.log('Disconnected from server');
        } else {
          console.error(response.error);
        };
      });
    };

    if (event.target.closest('#exec-button')) {
      serverRequest('/ssh', 'POST', {
        type: 'exec',
        command: 'ls -a'
      }, response => {
        if (response.success) {
          console.log(response);
        } else {
          console.error(response.error);
        };
      });
    };

    if (event.target.closest('#notification-button')) {
      serverRequest('/notification', 'POST', {
        title: 'Welcome to the Klein',
        body: 'Login to the server to get started',
        icon: 'img/icons/favicon.ico',
        sound: 'default',
      }, (err, res) => {
        console.log(err, res);
      });
    };
  });
});