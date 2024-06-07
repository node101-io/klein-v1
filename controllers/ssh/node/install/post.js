const sshRequest = require("../../../../utils/sshRequest");

const installNodeCommand = require("../../../../commands/node/install");

const installNode = (req, res) => {
  sshRequest('sftp:write_file', {
    host: req.body.host,
    path: 'klein-node/docker-compose.yaml',
    content: req.body.docker_compose_content
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    sshRequest('sftp:write_file', {
      host: req.body.host,
      path: 'klein-node/Dockerfile',
      content: req.body.dockerfile_content
    }, (err, data) => {
      if (err)
        return res.json({ err: err });

      sshRequest('exec', {
        host: req.body.host,
        command: installNodeCommand()
      }, (err, data) => {
        console.log(err, data);
        if (err)
          return res.json({ err: err });

        return res.json({ data: data });
      });
    });
  });
};

module.exports = (req, res) => {
  sshRequest('sftp:exists', {
    host: req.body.host,
    path: 'klein-node'
  }, (err, data) => {
    if (err && err != 'document_not_found')
      return res.json({ err: err });

    if (err)
      sshRequest('sftp:mkdir', {
        host: req.body.host,
        path: 'klein-node'
      }, (err, data) => {
        if (err)
          return res.json({ err: err });

        installNode(req, res);
      });
    else
      installNode(req, res);
  });
};