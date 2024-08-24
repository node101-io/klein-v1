const sshRequest = require('../../../../utils/sshRequest');

const uninstallDockerCommand = require('../../../../commands/docker/uninstall');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.session.last_connected_host,
    command: uninstallDockerCommand()
  }, (err, uninstall_docker_response) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: uninstall_docker_response.stdout });
  });
};
