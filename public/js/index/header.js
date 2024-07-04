window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.closest('.partials-header-each-button')) {
      const clickedButton = event.target.closest('.partials-header-each-button');

      console.log('heading to:', clickedButton.id.replace('partials-header-each-button-', ''));
    };

    if (event.target.closest('.partials-header-help-button')) {
      console.log('help button clicked');
    };

    if (event.target.closest('.partials-header-resize-button')) {
      document.querySelector('.partials-header-navbar-wrapper').classList.toggle('partials-header-navbar-wrapper-hidden');

      event.target.closest('.partials-header-resize-button').classList.toggle('partials-header-resize-button-reversed');
    };
  });
});