const sshRequest = require('../../../../utils/sshRequest');

const installDockerCommand = require('../../../../commands/docker/install');

module.exports = (req, res) => {
  sshRequest('exec:stream', {
    host: req.body.host,
    id: req.body.id,
    command: installDockerCommand()
  }, (err, output) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: output });
  });
};