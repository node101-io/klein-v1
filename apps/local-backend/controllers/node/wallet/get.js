module.exports = (req, res) => {
  if (!req.session.global_current_project || !req.session.global_current_project._id)
    // return res.redirect('/home');
  
  req.session.global_current_project = JSON.parse('{"_id":"66864bbc62120fe9e1355ecd","name":"Celestia","chain_registry_identifier":"celestiatestnet3","description":"Celestia is a modular data availability network that securely scales with the number of users, making it easy for anyone to launch their own blockchain.","image":[{"url":"https://node101.s3.eu-central-1.amazonaws.com/klein-project-celestiatestnet3-50w-50h","width":50,"height":50},{"url":"https://node101.s3.eu-central-1.amazonaws.com/klein-project-celestiatestnet3-100w-100h","width":100,"height":100},{"url":"https://node101.s3.eu-central-1.amazonaws.com/klein-project-celestiatestnet3-200w-200h","width":200,"height":200}],"non_generic_tx_commands":[],"properties":{"is_active":true,"is_incentivized":false,"is_mainnet":false,"is_visible":true},"system_requirements":{"cpu":"6 cores","ram":"8 GB","storage":"500 GB","os":"Ubuntu 20.04+"},"urls":{"web":"https://celestia.org/"},"translations":{"tr":{"name":"Celestia","description":"Celestia ipsum dolor sit amet."}},"is_completed":true}');
  return res.render('index', {
    page: 'node/wallet',
    title: res.__('node-wallet-page-title'),
    project: req.session.global_current_project
  });
};