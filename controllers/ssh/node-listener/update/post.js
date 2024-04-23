const sshRequest = require("../../../../utils/sshRequest");

const updateServerListenerCommand = require("../../../../commands/server-listener/update");

const versions = require("../../../../versions");

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: updateServerListenerCommand(versions.serverListener)
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    if (!data || data != 'running')
      return res.json({ err: 'node_listener_not_running' });

    return res.json({});
  });
};