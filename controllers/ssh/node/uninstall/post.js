const sshRequest = require("../../../../utils/sshRequest");

const uninstallNodeCommand = require("../../../../commands/node/uninstall");

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: uninstallNodeCommand()
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: data });
  });
};