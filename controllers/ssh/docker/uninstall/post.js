const sshRequest = require('../../../../utils/sshRequest');

const uninstallDockerCommand = require('../../../../commands/docker/uninstall');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: uninstallDockerCommand()
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: data });
  });
};