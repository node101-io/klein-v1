window.addEventListener('load', _ => {
  document.addEventListener('click', event => {
    if (event.target.closest('.index-general-each-project-install-button')) {
      console.log('install button clicked');
      // localhostRequest('/login?is_json=true', 'GET', {}, (err, res) => {
      //   // if (res.err) return;
      //   console.log(err, res);

      //   // navigatePage('/login', res.data);
      // });
    };
  });
});