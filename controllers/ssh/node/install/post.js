const sshRequest = require("../../../../utils/sshRequest");

const installNodeCommand = require("../../../../commands/node/install");

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: installNodeCommand(req.body.docker_compose_content, req.body.dockerfile_content)
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: data });
  });
};