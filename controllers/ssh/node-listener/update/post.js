const sshRequest = require("../../../../utils/sshRequest");

const updateNodeListenerCommand = require("../../../../commands/node-listener/update");

const versions = require("../../../../versions");

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: updateNodeListenerCommand(versions.nodeListener)
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    if (!data || data != 'running')
      return res.json({ err: 'node_listener_not_running' });

    return res.json({});
  });
};