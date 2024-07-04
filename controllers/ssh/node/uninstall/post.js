const sshRequest = require('../../../../utils/sshRequest');

const uninstallNodeCommand = require('../../../../commands/node/uninstall');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: uninstallNodeCommand()
  }, (err, uninstall_node_response) => {
    if (err)
      return res.json({ err: err });

    if (!uninstall_node_response.stout || !uninstall_node_response.stout.includes('Removed'))
      return res.json({ err: 'unknown_error' });

    return res.json({});
  });
};