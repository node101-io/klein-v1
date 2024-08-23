window.addEventListener('load', () => {
  const navbarWrapper = document.querySelector('.partials-header-navbar-wrapper');
  const navbarResizeButton = document.querySelector('.partials-header-resize-button');

  document.addEventListener('click', event => {
    if (event.target.closest('.partials-header-each-button')) {
      const page = event.target.closest('.partials-header-each-button').id.replace('partials-header-each-button-', '')

      if (page == 'home') {
        window.location.href = `/${page}`;
      } else if (page == 'search') {
        window.location.href = `/${page}`;
      } else if (page == 'new-node') {
        window.location.href = '/home';
      } else if (page == 'settings') {
        window.location.href = `/${page}`;
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