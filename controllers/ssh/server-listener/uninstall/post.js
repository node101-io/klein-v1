const sshRequest = require('../../../../utils/sshRequest');

const uninstallServerListenerCommand = require('../../../../commands/server-listener/uninstall');

const NO_SUCH_FILE_OR_DIRECTORY_MESSAGE_REGEX = /No such file or directory/;

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.session.last_connected_host,
    command: uninstallServerListenerCommand()
  }, (err, uninstall_server_listener_response) => {
    if (err)
      return res.json({ err: err });

    if (uninstall_server_listener_response.stderr && uninstall_server_listener_response.stderr.includes('Removed'))
      return res.json({});

    if (uninstall_server_listener_response.stderr && uninstall_server_listener_response.code == 1 && NO_SUCH_FILE_OR_DIRECTORY_MESSAGE_REGEX.test(uninstall_server_listener_response.stderr))
      return res.json({});

    return res.json({ err: 'unknown_error' });
  });
};
