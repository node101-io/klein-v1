const sshRequest = require("../../../../utils/sshRequest");

const checkNodeListenerExistentCommand = require("../../../../commands/node-listener/checkExistent");
const checkNodeListenerVersionCommand = require("../../../../commands/node-listener/checkVersion");

const versions = require("../../../../versions");

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: checkNodeListenerExistentCommand()
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    if (!data || data != 'running')
      return res.json({ err: 'node_listener_not_running' });

    sshRequest('exec', {
      host: req.body.host,
      command: checkNodeListenerVersionCommand()
    }, (err, data) => {
      if (err)
        return res.json({ err: err });

      if (!data || data != versions.nodeListener)
        return res.json({ err: 'node_listener_version_mismatch' });

      return res.json({ data: data });
    });
  });
};