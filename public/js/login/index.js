window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.closest('#login-button-key')) {
      serverRequest('/ssh', 'POST', {
        type: 'connect:key',
        host: '144.91.93.154',
        privateKeyPath: '/Users/necipsagiroglu/.ssh/2',
        passphrase: '2',
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
        password: 'correctpassword'
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

    if (event.target.closest('#exec-stream-button')) {
      const requestId = generateRandomHEX();

      onWebSocketData(requestId, (data) => console.log(data));

      serverRequest('/ssh', 'POST', {
        type: 'exec:stream',
        host: '144.91.93.154',
        command: 'journalctl -fu babylond -o cat',
        id: requestId,
      }, response => {
        if (response.success) {
          console.log(response);
        } else {
          console.error(response.error);
        };
      });
    };

    if (event.target.closest('#end-stream-button')) {
      endWebSocket(document.getElementById('id-value').value);
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

    if (event.target.closest('#pubkey-get-button')) {
      serverRequest('/ssh', 'POST', {
        type: 'key:local:create',
        path: '/Users/necipsagiroglu/.ssh/',
      }, (err, res) => {
        console.log(err, res);
      });
    };

    if (event.target.closest('#pubkey-remove-button')) {
      serverRequest('/ssh', 'POST', {
        type: 'key:local:delete',
        path: '/Users/necipsagiroglu/.ssh/',
        filename: '2',
      }, (err, res) => {
        console.log(err, res);
      });
    };

    if (event.target.closest('#pubkey-show-button')) {
      serverRequest('/ssh', 'POST', {
        type: 'key:local:list',
      }, (err, res) => {
        console.log(err, res);
      });
    };
  });
});