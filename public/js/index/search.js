// function

window.addEventListener('load', _ => {
  document.addEventListener('keydown', event => {
    if (event.key == 'Enter') {
      if (event.target.closest('.index-search-input')) {
        localhostRequest(`/project?name=${event.target.value}`, 'GET', {}, (err, projects) => {
          if (err)
            return console.error(err);

          const projectTemplate = document.querySelector('.index-general-each-project-wrapper');
          const projectsWrapper = document.getElementById('index-search-content-testnet-wrapper').firstChild;

          projectsWrapper.innerHTML = '';

          if (!projects.length)
            projectsWrapper.innerHTML = 'No project found';


          for (let i = 0; i < projects.length; i++) {
            const projectElement = document.createElement('div');

            projectElement.classList.add('index-general-each-project-wrapper');
            projectElement.innerHTML = projectTemplate.innerHTML;

            projectElement.querySelector('.index-general-each-project-image').src = projects[i].image[projects[i].image.length - 1].url;
            projectElement.querySelector('.index-general-each-project-name').innerText = projects[i].name
            projectElement.querySelector('.index-general-each-project-help-text').innerText = projects[i].description;
            projectElement.querySelector('.index-general-each-project-help-link').href = projects[i].urls.web
            projectElement.querySelector('.index-general-each-project-link').href = projects[i].urls.web
            projectElement.querySelector('.index-general-each-project-install-button').id = `index-general-each-project-install-button-${projects[i]._id}`;

            projectsWrapper.appendChild(projectElement);
          };
        });
      };
    };
  });
});