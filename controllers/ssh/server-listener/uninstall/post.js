const sshRequest = require("../../../../utils/sshRequest");

const uninstallServerListenerCommand = require("../../../../commands/server-listener/uninstall");

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: uninstallServerListenerCommand()
  }, (err, data) => {
    if (!err || !err.includes('Stopped') || !err.includes('Removed'))
      return res.json({ err: 'unknown_error' });

    return res.json({});
  });
};