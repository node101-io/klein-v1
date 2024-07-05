// function

window.addEventListener('load', _ => {
  document.addEventListener('keydown', event => {
    if (event.key == 'Enter') {
      if (event.target.closest('.index-search-input')) {
        localhostRequest(`/project?name=${event.target.value}`, 'GET', {}, (err, projects) => {
          // if (err)
          //   return console.error(err);

          // mock
          projects = [
            {
              "_id": "66864bbc62120fe9e1355ecd", "name": "Celestia", "chain_registry_identifier": "celestiatestnet3", "description": "Celestia ipsum dolor sit amet.", "image": [{ "url": "https://node101.s3.eu-central-1.amazonaws.com/klein-project-celestiatestnet3-50w-50h", "width": 50, "height": 50 }, { "url": "https://node101.s3.eu-central-1.amazonaws.com/klein-project-celestiatestnet3-100w-100h", "width": 100, "height": 100 }, { "url": "https://node101.s3.eu-central-1.amazonaws.com/klein-project-celestiatestnet3-200w-200h", "width": 200, "height": 200 }], "non_generic_tx_commands": [], "properties": { "is_active": true, "is_incentivized": false, "is_mainnet": false, "is_visible": true }, "system_requirements": {}, "urls": { "web": "https://celestia.org/" }, "translations": { "tr": { "name": "Celestia", "description": "Celestia ipsum dolor sit amet." } }, "is_completed": true
            },
            {
              "_id": "66865df71d092f75488395fa", "name": "Lava", "chain_registry_identifier": "lavatestnet", "description": "Lava ipsum dolor sit amet", "image": [{ "url": "https://node101.s3.eu-central-1.amazonaws.com/klein-project-lavatestnet-50w-50h", "width": 50, "height": 50 }, { "url": "https://node101.s3.eu-central-1.amazonaws.com/klein-project-lavatestnet-100w-100h", "width": 100, "height": 100 }, { "url": "https://node101.s3.eu-central-1.amazonaws.com/klein-project-lavatestnet-200w-200h", "width": 200, "height": 200 }], "non_generic_tx_commands": [], "properties": { "is_active": false, "is_incentivized": false, "is_mainnet": false, "is_visible": false }, "system_requirements": {}, "urls": { "web": "https://www.lavanet.xyz/" }, "translations": { "tr": { "name": "Lava", "description": "Lava ipsum dolor sit amet" } }, "is_completed": true
            },
            {
              "_id": "66865f891d092f7548839616", "name": "Cosmos Hub", "chain_registry_identifier": "cosmosicsprovidertestnet", "description": "Cosmos ipsum dolor sit amet", "image": [{ "url": "https://node101.s3.eu-central-1.amazonaws.com/klein-project-cosmosicsprovidertestnet-50w-50h", "width": 50, "height": 50 }, { "url": "https://node101.s3.eu-central-1.amazonaws.com/klein-project-cosmosicsprovidertestnet-100w-100h", "width": 100, "height": 100 }, { "url": "https://node101.s3.eu-central-1.amazonaws.com/klein-project-cosmosicsprovidertestnet-200w-200h", "width": 200, "height": 200 }], "non_generic_tx_commands": [], "properties": { "is_active": false, "is_incentivized": false, "is_mainnet": false, "is_visible": false }, "system_requirements": {}, "urls": { "web": "https://hub.cosmos.network/main" }, "translations": { "tr": { "name": "Cosmos Hub", "description": "Cosmos ipsum dolor sit amet" } }, "is_completed": true
            }
          ];

          const projectTemplate = document.querySelector('.index-general-each-project-wrapper');
          const projectsWrapper = document.getElementById('index-search-content-testnet-wrapper').firstChild;

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