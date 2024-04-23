const sshRequest = require("../../../../utils/sshRequest");

const installServerListenerCommand = require("../../../../commands/server-listener/install");

const versions = require("../../../../versions");

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: installServerListenerCommand(versions.serverListener)
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    if (!data || data != 'running')
      return res.json({ err: 'node_listener_not_running' });

    return res.json({});
  });
};