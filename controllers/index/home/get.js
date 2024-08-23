const fetch = require('../../../utils/fetch');

module.exports = (req, res) => {
  // fetch(`https://admin.klein.run/api/projects${req.query.id && typeof req.query.id == "string" && req.query.id.trim().length ? `?id=${req.query.id.trim()}` : ''}`, {}, (err, data) => {
  //   if (err)
  //     return res.json({ err: err });

  //   if (!data.success)
  //     return res.json({ err: data.err });

  //   return res.render('index', {
  //     page: 'index/home',
  //     title: 'Home',
  //     projects: data.projects
  //   });
  // });

  if (true) {
    console.log('true');
  };


  return res.render('index', {
    page: 'index/home',
    title: 'Home',
    projects: [
      {
        "_id": "66864bbc62120fe9e1355ecd", "name": "Celestia", "chain_registry_identifier": "celestiatestnet3", "description": "Celestia ipsum dolor sit amet.", "image": [{ "url": "https://node101.s3.eu-central-1.amazonaws.com/klein-project-celestiatestnet3-50w-50h", "width": 50, "height": 50 }, { "url": "https://node101.s3.eu-central-1.amazonaws.com/klein-project-celestiatestnet3-100w-100h", "width": 100, "height": 100 }, { "url": "https://node101.s3.eu-central-1.amazonaws.com/klein-project-celestiatestnet3-200w-200h", "width": 200, "height": 200 }], "non_generic_tx_commands": [], "properties": { "is_active": true, "is_incentivized": false, "is_mainnet": false, "is_visible": true }, "system_requirements": {}, "urls": { "web": "https://celestia.org/" }, "translations": { "tr": { "name": "Celestia", "description": "Celestia ipsum dolor sit amet." } }, "is_completed": true
      },
      {
        "_id": "66865df71d092f75488395fa", "name": "Lava", "chain_registry_identifier": "lavatestnet", "description": "Lava ipsum dolor sit amet", "image": [{ "url": "https://node101.s3.eu-central-1.amazonaws.com/klein-project-lavatestnet-50w-50h", "width": 50, "height": 50 }, { "url": "https://node101.s3.eu-central-1.amazonaws.com/klein-project-lavatestnet-100w-100h", "width": 100, "height": 100 }, { "url": "https://node101.s3.eu-central-1.amazonaws.com/klein-project-lavatestnet-200w-200h", "width": 200, "height": 200 }], "non_generic_tx_commands": [], "properties": { "is_active": false, "is_incentivized": false, "is_mainnet": false, "is_visible": false }, "system_requirements": {}, "urls": { "web": "https://www.lavanet.xyz/" }, "translations": { "tr": { "name": "Lava", "description": "Lava ipsum dolor sit amet" } }, "is_completed": true
      },
      {
        "_id": "66865f891d092f7548839616", "name": "Cosmos Hub", "chain_registry_identifier": "cosmosicsprovidertestnet", "description": "Cosmos ipsum dolor sit amet", "image": [{ "url": "https://node101.s3.eu-central-1.amazonaws.com/klein-project-cosmosicsprovidertestnet-50w-50h", "width": 50, "height": 50 }, { "url": "https://node101.s3.eu-central-1.amazonaws.com/klein-project-cosmosicsprovidertestnet-100w-100h", "width": 100, "height": 100 }, { "url": "https://node101.s3.eu-central-1.amazonaws.com/klein-project-cosmosicsprovidertestnet-200w-200h", "width": 200, "height": 200 }], "non_generic_tx_commands": [], "properties": { "is_active": false, "is_incentivized": false, "is_mainnet": false, "is_visible": false }, "system_requirements": {}, "urls": { "web": "https://hub.cosmos.network/main" }, "translations": { "tr": { "name": "Cosmos Hub", "description": "Cosmos ipsum dolor sit amet" } }, "is_completed": true
      }
    ]
  });
};
