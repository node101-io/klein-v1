window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.closest('#appKey-auth-button')) {
      localhostRequest('/auth', 'POST', {
        appKey: document.getElementById('appKey-value').value,
      }, (err, res) => {
        if (err)
          return console.error(err);

        window.location.reload();
      });
    };
  });
});