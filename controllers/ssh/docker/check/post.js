const sshRequest = require('../../../../utils/sshRequest');

const checkDockerExistentCommand = require('../../../../commands/docker/checkExistent');
const checkDockerSetupCommand = require('../../../../commands/docker/checkSetup');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: checkDockerExistentCommand()
  }, (err, docker_existent) => {
    if (err)
      return res.json({ err: err });

    if (!docker_existent || docker_existent != '0')
      return res.json({ err: 'docker_not_installed' });

    sshRequest('exec', {
      host: req.body.host,
      command: checkDockerSetupCommand()
    }, (err, status) => {
      if (err)
        return res.json({ err: err });

      if (!status || status != 'active')
        return res.json({ err: 'docker_not_running' });

      return res.json({});
    });
  });
};