const sshRequest = require('../../../../utils/sshRequest');

const uninstallServerListenerCommand = require('../../../../commands/server-listener/uninstall');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: uninstallServerListenerCommand()
  }, (err, uninstall_server_listener_response) => {
    if (err)
      return res.json({ err: err });

    if (!uninstall_server_listener_response.stdout || !uninstall_server_listener_response.stdout.includes('Removed'))
      return res.json({ err: 'unknown_error' });

    return res.json({});
  });
};