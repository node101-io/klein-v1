const path = require('path');
const sshRequest = require('../../../../../utils/sshRequest');

const installSnapshotCommand = require('../../../../../commands/node/installSnaphot');
const removeDataFolderCommand = require('../../../../../commands/node/removeDataFolder');

const DATA_FOLDER_PATH = '/var/lib/docker/volumes/klein-node_klein-node-volume/_data/data';

module.exports = (req, res) => {
  sshRequest('sftp:read_file', {
    host: req.body.host,
    path: path.join(DATA_FOLDER_PATH, 'priv_validator_state.json')
  }, (err, priv_validator_state) => {
    if (err)
      return res.json({ err: err });

    sshRequest('exec', {
      host: req.body.host,
      command: removeDataFolderCommand()
    }, (err, data) => {
      if (err)
        return res.json({ err: err });

      sshRequest('sftp:write_file', {
        host: req.body.host,
        path: path.join(DATA_FOLDER_PATH, 'priv_validator_state.json'),
        content: priv_validator_state
      }, (err, data) => {
        if (err)
          return res.json({ err: err });

        sshRequest('exec:stream', {
          host: req.body.host,
          id: req.body.id,
          command: installSnapshotCommand(),
          in_container: true
        }, (err, output) => {
          if (err)
            return res.json({ err: err });

          return res.json({ data: output });
        });
      });
    });
  });
};