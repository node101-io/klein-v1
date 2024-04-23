const sshRequest = require("../../../../utils/sshRequest");

const uninstallServerListenerCommand = require("../../../../commands/server-listener/install");

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: uninstallServerListenerCommand()
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({});
  });
};