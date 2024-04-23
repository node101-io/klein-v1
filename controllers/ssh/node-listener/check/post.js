const sshRequest = require("../../../../utils/sshRequest");

const checkServerListenerExistentCommand = require("../../../../commands/server-listener/checkExistent");
const checkServerListenerVersionCommand = require("../../../../commands/server-listener/checkVersion");

const versions = require("../../../../versions");

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: checkServerListenerExistentCommand()
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    if (!data || data != 'running')
      return res.json({ err: 'node_listener_not_running' });

    sshRequest('exec', {
      host: req.body.host,
      command: checkServerListenerVersionCommand()
    }, (err, data) => {
      if (err)
        return res.json({ err: err });

      if (!data || data != versions.serverListener)
        return res.json({ err: 'node_listener_version_mismatch' });

      return res.json({ data: data });
    });
  });
};