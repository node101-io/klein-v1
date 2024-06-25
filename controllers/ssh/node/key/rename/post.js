const sshRequest = require('../../../../../utils/sshRequest');

const renameKeyInNodeCommand = require('../../../../../commands/node/key/rename');

const KEY_NOT_FOUND_ERROR_MESSAGE_REGEX = /Error: (.*?): key not found/;
const KEY_ALREADY_EXISTS_ERROR_MESSAGE_REGEX = /Error: rename failed: (.*?) already exists in the keyring/

module.exports = (req, res) => {
  if (!req.body.key_name)
    return res.json({ err: 'bad_request' });

  if (!req.body.new_key_name)
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: renameKeyInNodeCommand(req.body.key_name, req.body.new_key_name),
    in_container: true
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    if (KEY_NOT_FOUND_ERROR_MESSAGE_REGEX.test(data))
      return res.json({ err: 'key_not_found' });

    if (KEY_ALREADY_EXISTS_ERROR_MESSAGE_REGEX.test(data))
      return res.json({ err: 'key_name_already_exists' });

    return res.json({});
  });
};