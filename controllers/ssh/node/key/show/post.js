const sshRequest = require('../../../../../utils/sshRequest');

const showKeyInNodeCommand = require('../../../../../commands/node/key/show');

const DEFAULT_MAX_TEXT_FIELD_LENGTH = 1e4;
const INVALID_NAME_ERROR_MESSAGE_REGEX = /Error: (.*?) is not a valid name or address/;
const KEY_TYPE_VALUES = [
  'account',
  'validator',
  'consensus'
];

module.exports = (req, res) => {
  if (!req.body.key_name || typeof req.body.key_name != 'string' || !req.body.key_name.trim().length || req.body.key_name.trim().length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  if (!req.body.key_type || typeof req.body.key_type != 'string' || !KEY_TYPE_VALUES.includes(req.body.key_type))
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.session.last_connected_host,
    command: showKeyInNodeCommand({
      key_name: req.body.key_name,
      key_type: req.body.key_type
    }),
    in_container: true
  }, (err, show_key_in_node_response) => {
    if (err)
      return res.json({ err: err });

    if (INVALID_NAME_ERROR_MESSAGE_REGEX.test(show_key_in_node_response.stderr))
      return res.json({ err: 'key_not_found' });

    return res.json({ data: show_key_in_node_response.stdout });
  });
};