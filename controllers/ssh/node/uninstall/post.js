const sshRequest = require('../../../../utils/sshRequest');

const uninstallNodeCommand = require('../../../../commands/node/uninstall');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.session.host,
    command: uninstallNodeCommand()
  }, (err, uninstall_node_response) => {
    if (err)
      return res.json({ err: err });

    if (!uninstall_node_response.stderr || !uninstall_node_response.stderr.includes('Removed'))
      return res.json({ err: 'unknown_error' });

    return res.json({});
  });
};