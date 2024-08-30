function loadPageIndexSearch() {
  loadingStart();

  localhostRequest('/search', 'POST', {}, (err, projects) => {
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
  document.addEventListener('keydown', event => {
    if (event.key == 'Enter' && event.target.closest('.index-search-input')) {
      loadingStart();

      localhostRequest('/search', 'POST', {
        name: event.target.value
      }, (err, projects) => {
        if (err)
          return console.error(err);

        localhostRequest('/templates/general-project-wrapper', 'POST', {
          projects: projects
        }, (err, html) => {
          if (err)
            return console.error(err);

          document.getElementById('index-search-content-testnet-wrapper').firstChild.innerHTML = html;

          loadingStop();
        });
      });
    };
  });
});
