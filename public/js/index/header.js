window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.closest('.partials-header-each-button')) {
      const page = event.target.closest('.partials-header-each-button').id.replace('partials-header-each-button-', '')

      if (page == 'home') {
        window.location.href = `/${page}?lang=tr`;
      } else if (page == 'search') {
        window.location.href = `/${page}?lang=tr`;
      } else if (page == 'new-node') {
        window.location.href = '/home?lang=tr';
      } else if (page == 'settings') {
        window.location.href = `/${page}?lang=tr`;
      };
    };

    if (event.target.closest('.partials-header-help-button')) {
      console.log('help button clicked');
    };

    if (event.target.closest('.partials-header-resize-button')) {
      document.querySelector('.partials-header-navbar-wrapper').classList.toggle('partials-header-navbar-wrapper-collapsed');
      document.querySelector('.partials-header-resize-button').classList.toggle('partials-header-resize-button-collapsed');

      event.target.closest('.partials-header-resize-button').classList.toggle('partials-header-resize-button-reversed');
    };
  });
});