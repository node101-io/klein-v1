const sshRequest = require('../../../../utils/sshRequest');

const uninstallNodeCommand = require('../../../../commands/node/uninstall');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: uninstallNodeCommand()
  }, (err, data) => {
    if (!err || !err.includes('Stopped') || !err.includes('Removed')) // TODO: fix
      return res.json({ err: 'unknown_error' });

    return res.json({});
  });
};