const sshRequest = require('../../../../utils/sshRequest');

const checkDockerExistentCommand = require('../../../../commands/docker/checkExistent');
const checkDockerSetupCommand = require('../../../../commands/docker/checkSetup');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.session.last_connected_host,
    command: checkDockerExistentCommand()
  }, (err, check_docker_existent_response) => {
    if (err)
      return res.json({ err: err });

    if (!check_docker_existent_response.stdout || check_docker_existent_response.stdout != '0')
      return res.json({ err: 'docker_not_installed' });

    sshRequest('exec', {
      host: req.session.last_connected_host,
      command: checkDockerSetupCommand()
    }, (err, check_docker_setup_response) => {
      if (err)
        return res.json({ err: err });

      if (!check_docker_setup_response.stdout || check_docker_setup_response.stdout != 'active')
        return res.json({ err: 'docker_not_running' });

      return res.json({});
    });
  });
};