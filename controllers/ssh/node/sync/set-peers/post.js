const sshRequest = require('../../../../../utils/sshRequest');

const setNodeConfigVariableCommand = require('../../../../../commands/node/setConfigVariable');

module.exports = (req, res) => {
  if (!req.body.peers || !Array.isArray(req.body.peers))
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.session.last_connected_host,
    command: setNodeConfigVariableCommand('persistent_peers', req.body.peers.join(','))
  }, (err, set_node_config_variable_response) => {
    if (err)
      return res.json({ err: err });

    return res.json({});
  });
};
