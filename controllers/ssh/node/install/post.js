const sshRequest = require('../../../../utils/sshRequest');

const installNodeCommand = require('../../../../commands/node/install');

const createNodeFolder = (host, callback) => {
  sshRequest('sftp:exists', {
    host: host,
    path: 'klein-node'
  }, (err, data) => {
    if (err && err != 'document_not_found')
      return callback(err);

    if (err)
      sshRequest('sftp:mkdir', {
        host: host,
        path: 'klein-node'
      }, (err, data) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    else
      return callback(null);
  });
};

const installNode = (data, callback) => {
  sshRequest('sftp:write_file', {
    host: data.host,
    path: 'klein-node/docker-compose.yaml',
    content: data.docker_compose_content
  }, (err, output) => {
    if (err)
      return callback(err);

    sshRequest('sftp:write_file', {
      host: data.host,
      path: 'klein-node/Dockerfile',
      content: data.dockerfile_content
    }, (err, output) => {
      if (err)
        return callback(err);

      sshRequest('exec:stream', {
        host: data.host,
        id: data.id,
        command: installNodeCommand()
      }, (err, output) => {
        if (err)
          return callback(err);

        sshRequest('sftp:write_file', {
          host: data.host,
          path: 'server-listener/data/project-route.txt',
          content: data.project_route
        }, (err, output) => {
          if (err)
            return callback(err);

          return callback(null);
        });
      });
    });
  });
};

module.exports = (req, res) => {
  if (!req.body.docker_compose_content || typeof req.body.docker_compose_content != 'string')
    return res.json({ err: 'bad_request' });

  if (!req.body.dockerfile_content || typeof req.body.dockerfile_content != 'string')
    return res.json({ err: 'bad_request' });

  if (!req.body.project_route || typeof req.body.project_route != 'string')
    return res.json({ err: 'bad_request' });

  createNodeFolder(req.body.host, err => {
    if (err)
      return res.json({ err: err });

    installNode({
      host: req.body.host,
      id: req.body.id,
      docker_compose_content: req.body.docker_compose_content,
      dockerfile_content: req.body.dockerfile_content,
      project_route: req.body.project_route
    }, (err, output) => {
      if (err)
        return res.json({ err: err });

      return res.json({ data: output });
    });
  });
};