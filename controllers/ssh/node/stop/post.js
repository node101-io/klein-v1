const sshRequest = require('../../../../utils/sshRequest');

const stopNodeCommand = require('../../../../commands/node/stop');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.session.last_connected_host,
    command: stopNodeCommand()
  }, (err, stop_node_response) => {
    if (err)
      return res.json({ err: err });

    return res.json({});
  });
};
