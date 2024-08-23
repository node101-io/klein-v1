const sshRequest = require('../../../../utils/sshRequest');

const startNodeCommand = require('../../../../commands/node/start');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.session.last_connected_host,
    command: startNodeCommand()
  }, (err, start_node_response) => {
    if (err)
      return res.json({ err: err });

    return res.json({});
  });
};