window.addEventListener('load', _ => {
  document.addEventListener('keydown', event => {
    if (event.key == 'Enter') {
      if (event.target.closest('.index-search-input')) {
        localhostRequest(`/project?name=${event.target.value}`, 'GET', {}, (err, projects) => {
          if (err)
            return console.error(err);

          console.log('search results:', projects);
        });
      };
    };
  });
});