const sshRequest = require('../../../../utils/sshRequest');

const installServerListenerCommand = require('../../../../commands/server-listener/install');

const versions = require('../../../../versions.json');

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

module.exports = (req, res) => {
  createFolderIfNotExists(req.session.last_connected_host, 'klein-node-volume', err => {
    if (err)
      return callback(err);

    sshRequest('exec', {
      host: req.session.last_connected_host,
      command: installServerListenerCommand(versions.serverListener)
    }, (err, install_server_listener_response) => {
      if (err)
        return res.json({ err: err });

      return res.json({ data: install_server_listener_response.stdout });
    });
  });
};
