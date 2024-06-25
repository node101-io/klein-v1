const sshRequest = require('../../../../utils/sshRequest');

const uninstallNodeCommand = require('../../../../commands/node/uninstall');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: uninstallNodeCommand()
  }, (err, output) => {
    if (err)
      return res.json({ err: err });

    if (!output || !output.includes('Stopped') || !output.includes('Removed'))
      return res.json({ err: 'unknown_error' });

    return res.json({});
  });
};