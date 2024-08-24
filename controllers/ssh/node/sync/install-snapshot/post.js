const path = require('path');
const sshRequest = require('../../../../../utils/sshRequest');

const installSnapshotCommand = require('../../../../../commands/node/installSnaphot');
const removeDataFolderCommand = require('../../../../../commands/node/removeDataFolder');

const DATA_FOLDER_PATH = '$HOME/klein-node-volume/data';

module.exports = (req, res) => {
  sshRequest('sftp:read_file', {
    host: req.session.last_connected_host,
    path: path.join(DATA_FOLDER_PATH, 'priv_validator_state.json')
  }, (err, priv_validator_state) => {
    if (err)
      return res.json({ err: err });

    sshRequest('exec', {
      host: req.session.last_connected_host,
      command: removeDataFolderCommand()
    }, (err, remove_data_folder_response) => {
      if (err)
        return res.json({ err: err });

      sshRequest('sftp:write_file', {
        host: req.session.last_connected_host,
        path: path.join(DATA_FOLDER_PATH, 'priv_validator_state.json'),
        content: priv_validator_state
      }, (err, data) => {
        if (err)
          return res.json({ err: err });

        sshRequest('exec:stream', {
          host: req.session.last_connected_host,
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
