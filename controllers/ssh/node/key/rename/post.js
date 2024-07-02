const sshRequest = require('../../../../../utils/sshRequest');

const renameKeyInNodeCommand = require('../../../../../commands/node/key/rename');

const DEFAULT_MAX_TEXT_FIELD_LENGTH = 1e4;
const KEY_NOT_FOUND_ERROR_MESSAGE_REGEX = /Error: (.*?): key not found/;
const KEY_ALREADY_EXISTS_ERROR_MESSAGE_REGEX = /Error: rename failed: (.*?) already exists in the keyring/

module.exports = (req, res) => {
  if (!req.body.key_name || typeof req.body.key_name != 'string' || !req.body.key_name.trim().length || req.body.key_name.trim().length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  if (!req.body.new_key_name || typeof req.body.new_key_name != 'string' || !req.body.new_key_name.trim().length || req.body.new_key_name.trim().length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: renameKeyInNodeCommand(req.body.key_name, req.body.new_key_name),
    in_container: true
  }, (err, remove_key_in_node_response) => {
    if (err)
      return res.json({ err: err });

    if (KEY_ALREADY_EXISTS_ERROR_MESSAGE_REGEX.test(remove_key_in_node_response.stderr))
      return res.json({ err: 'key_name_already_exists' });

    if (KEY_NOT_FOUND_ERROR_MESSAGE_REGEX.test(remove_key_in_node_response.stderr))
      return res.json({ err: 'key_not_found' });

    return res.json({});
  });
};