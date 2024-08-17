const sshRequest = require('../../../../../utils/sshRequest');

const deleteKeyInNodeCommand = require('../../../../../commands/node/key/delete');

const DEFAULT_MAX_TEXT_FIELD_LENGTH = 1e4;
const KEY_NOT_FOUND_ERROR_MESSAGE_REGEX = /Error: (.*?): key not found/;

module.exports = (req, res) => {
  if (!req.body.key_name || typeof req.body.key_name != 'string' || !req.body.key_name.trim().length || req.body.key_name.trim().length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.session.host,
    command: deleteKeyInNodeCommand({
      key_name: req.body.key_name
    }),
    in_container: true
  }, (err, delete_key_in_node_response) => {
    if (err)
      return res.json({ err: err });

    if (KEY_NOT_FOUND_ERROR_MESSAGE_REGEX.test(delete_key_in_node_response.stderr))
      return res.json({ err: 'key_not_found' });

    return res.json({});
  });
};