window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.closest('#login-button-key')) {
      serverRequest('/ssh', 'POST', {
        type: 'connect:key',
        host: '144.91.93.154',
        passphrase: 'essek',
      }, response => {
        if (response.success) {
          console.log('Connected to server');
        } else {
          console.error(response.error);
        };
      });
    };

    if (event.target.closest('#login-button-password')) {
      serverRequest('/ssh', 'POST', {
        type: 'connect:password',
        host: '144.91.93.154',
        // password: ''
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
        host: '144.91.93.154',
        type: 'disconnect',
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
        host: '144.91.93.154',
        command: 'ls -a',
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