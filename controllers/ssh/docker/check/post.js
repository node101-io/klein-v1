const sshRequest = require("../../../../utils/sshRequest");

const checkDockerExistentCommand = require("../../../../commands/docker/checkExistent");
const checkDockerSetupCommand = require("../../../../commands/docker/checkSetup");

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: checkDockerExistentCommand()
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    if (!data || data != '0')
      return res.json({ err: 'docker_not_installed' });

    sshRequest('exec', {
      host: req.body.host,
      command: checkDockerSetupCommand()
    }, (err, data) => {
      if (err)
        return res.json({ err: err });

      if (!data || data != 'active')
        return res.json({ err: 'docker_not_running' });

      return res.json({});
    });
  });
};