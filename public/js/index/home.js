window.addEventListener('load', _ => {
  if (event.target.closest('.index-general-each-project-install-button')) {
    serverRequest('/login', 'GET', {}, res => {
      if (res.error) return;

      navigatePage('/login', res.data);
    })
  }
});