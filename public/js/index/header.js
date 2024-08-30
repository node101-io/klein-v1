window.addEventListener('load', () => {
  const navbarWrapper = document.querySelector('.partials-header-navbar-wrapper');

  document.addEventListener('click', event => {
    if (event.target.closest('.partials-header-each-button')) {
      const page = event.target.closest('.partials-header-each-button').id.replace('partials-header-each-button-', '')

      if (page == 'home') {
        navigatePage('/home')
      } else if (page == 'search') {
        navigatePage('/search')
      } else if (page == 'new-node') {
        navigatePage('/home');
      } else if (page == 'login') {
        const project_id = event.target.closest('.partials-header-each-button').getAttribute('data-project-id');
        const server_host = event.target.closest('.partials-header-each-button').getAttribute('data-server-host');

        if (!project_id)
          return navigatePage('/home');

        navigatePage('/login', {
          index_login_project_id: project_id,
          index_login_will_install: false, // TODO: fix
          index_login_server_host: server_host
        });
      };
    };

    if (event.target.closest('.partials-header-help-button')) {
      console.log('help button clicked');
    };

    if (event.target.closest('.partials-header-resize-button')) {
      localhostRequest('/session/set', 'POST', {
        key: 'navbar_collapsed',
        value: navbarWrapper.classList.toggle('partials-header-navbar-wrapper-collapsed')
      }, (err, res) => {
        if (err)
          return console.error(err);

        return console.log(res);
      });
    };
  });
});
