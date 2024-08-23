const sshRequest = require('../../../../utils/sshRequest');

const restartNodeCommand = require('../../../../commands/node/restart');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.session.last_connected_host,
    command: restartNodeCommand()
  }, (err, restart_node_response) => {
    if (err)
      return res.json({ err: err });

    return res.json({});
  });
};