const sshRequest = require('../../../../utils/sshRequest');

const installNodeCommand = require('../../../../commands/node/install');

const installNode = (data, callback) => {
  sshRequest('sftp:write_file', {
    host: data.host,
    path: 'klein-node/docker-compose.yaml',
    content: data.docker_compose_content
  }, (err, data) => {
    if (err)
      return callback(err);

    sshRequest('sftp:write_file', {
      host: data.host,
      path: 'klein-node/Dockerfile',
      content: data.dockerfile_content
    }, (err, data) => {
      if (err)
        return callback(err);

      sshRequest('exec:stream', {
        host: data.host,
        id: data.id,
        command: installNodeCommand()
      }, (err, output) => {
        if (err)
          return callback(err);

        return callback(null, output);
      });
    });
  });
};

module.exports = (req, res) => {
  if (!req.body.docker_compose_content || typeof req.body.docker_compose_content != 'string')
    return res.json({ err: 'bad_request' });

  if (!req.body.dockerfile_content || typeof req.body.dockerfile_content != 'string')
    return res.json({ err: 'bad_request' });

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

        installNode(req.body, (err, output) => {
          if (err)
            return res.json({ err: err });

          return res.json({ data: output });
        });
      });
    else
      installNode(req.body, (err, output) => {
        if (err)
          return res.json({ err: err });

        return res.json({ data: output });
      });
  });
};