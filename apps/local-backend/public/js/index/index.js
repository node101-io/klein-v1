window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.closest('.index-general-each-project-install-button')) {
      const projectIdToInstall = event.target.closest('.index-general-each-project-install-button').getAttribute('data-project-id');

      navigatePage('/login', {
        index_login_project_id: projectIdToInstall,
        index_login_will_install: true,
      });
    };
  });
});
