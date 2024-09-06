const sshRequest = require('../../../../utils/sshRequest');

const installDockerCommand = require('../../../../commands/docker/install');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.session.last_connected_host,
    command: installDockerCommand()
  }, (err, install_docker_response) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: install_docker_response.stdout });
  });
};
