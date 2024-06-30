const sshRequest = require('../../../../utils/sshRequest');

const installNodeCommand = require('../../../../commands/node/install');

const createFolderIfNotExists = (host, path, callback) => {
  sshRequest('sftp:exists', {
    host: host,
    path: path
  }, (err, data) => {
    if (err && err != 'document_not_found')
      return callback(err);

    if (err)
      sshRequest('sftp:mkdir', {
        host: host,
        path: path
      }, (err, data) => {
        if (err)
          return callback(err);

        return callback(null);
      });
    else
      return callback(null);
  });
};

const createNecessaryNodeFolders = (host, callback) => {
  createFolderIfNotExists(host, 'klein-node', err => {
    if (err)
      return callback(err);

    createFolderIfNotExists(host, 'klein-node-volume', err => {
      if (err)
        return callback(err);

      createFolderIfNotExists(host, 'klein-scripts-volume', err => {
        if (err)
          return callback(err);

        return callback(null);
      });
    });
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
          path: 'klein-node-volume/klein-node-route.txt',
          content: data.project_route
        }, (err, output) => {
          if (err)
            return callback(err);

          return callback(null, output);
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

  createNecessaryNodeFolders(req.body.host, err => {
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