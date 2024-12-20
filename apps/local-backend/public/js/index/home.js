function loadPageIndexHome(data) {
  loadingStart();

  localhostRequest('/home', 'POST', {}, (err, projects) => {
    if (err)
      console.error(err);

    localhostRequest('/templates/general-project-wrapper', 'POST', {
      projects: projects
    }, (err, html) => {
      if (err)
        console.error(err);

      document.querySelector('.index-general-projects-wrapper').innerHTML = html;

      loadingStop();
    });
  });
};

window.addEventListener('load', _ => {
  document.addEventListener('click', event => {
    if (event.target.closest('.index-home-header-each-button')) {
      const clickedButton = event.target.closest('.index-home-header-each-button');

      if (clickedButton.classList.contains('index-home-header-each-button-active')) return;

      document.querySelector('.index-home-header-each-button-active').classList.remove('index-home-header-each-button-active');
      clickedButton.classList.add('index-home-header-each-button-active');

      const pageToDisplay = clickedButton.id.replace('index-home-header-each-button-', '');

      document.getElementById(`index-home-content-${pageToDisplay}-wrapper`).classList.toggle('display-none');
      document.getElementById(`index-home-content-${pageToDisplay == 'mainnet' ? 'testnet' : 'mainnet'}-wrapper`).classList.add('display-none');
    };
  });
});
