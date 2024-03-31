const sshRequest = require("../../../../utils/sshRequest");

const uninstallNodeListenerCommand = require("../../../../commands/node-listener/install");

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: uninstallNodeListenerCommand()
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({});
  });
};