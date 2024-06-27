const sshRequest = require('../../../../utils/sshRequest');

const uninstallServerListenerCommand = require('../../../../commands/server-listener/uninstall');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: uninstallServerListenerCommand()
  }, (err, output) => {
    if (!output || !output.includes('Removed'))
      return res.json({ err: 'unknown_error' });

    return res.json({});
  });
};