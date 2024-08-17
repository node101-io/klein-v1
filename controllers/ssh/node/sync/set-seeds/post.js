const sshRequest = require('../../../../../utils/sshRequest');

const setNodeConfigVariableCommand = require('../../../../../commands/node/setConfigVariable');

module.exports = (req, res) => {
  if (!req.body.seeds || !Array.isArray(req.body.seeds))
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.session.host,
    command: setNodeConfigVariableCommand('seeds', req.body.seeds.join(','))
  }, (err, set_node_config_variable_response) => {
    if (err)
      return res.json({ err: err });

    return res.json({});
  });
};