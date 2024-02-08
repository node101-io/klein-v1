window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.closest('#login-button')) {
      console.log('Login button clicked')
      serverRequest('/ssh/connect', 'POST', {
        username: 'root',
        host: '144.91.93.154',
      }, response => {
        if (response.success) {
          console.log('Connected to server');
        } else {
          console.error(response.error);
        };
      });
    };

    if (event.target.closest('#logout-button')) {
      console.log('Logout button clicked')
      serverRequest('/ssh/disconnect', 'POST', {}, response => {
        if (response.success) {
          console.log('Disconnected from server');
        } else {
          console.error(response.error);
        };
      });
    };

    if (event.target.closest('#exec-button')) {
      console.log('Exec button clicked')
      serverRequest('/ssh/exec', 'POST', {
        command: 'ls -a'
      }, response => {
        if (response.success) {
          console.log(response);
        } else {
          console.error(response.error);
        };
      });
    };
  });
});