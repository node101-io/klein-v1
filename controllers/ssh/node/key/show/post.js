const sshRequest = require('../../../../../utils/sshRequest');

const showKeyInNodeCommand = require('../../../../../commands/node/key/show');

const INVALID_NAME_ERROR_MESSAGE_REGEX = /Error: (.*?) is not a valid name or address/;
const KEY_TYPE_VALUES = [
  'account',
  'validator',
  'consensus'
];

module.exports = (req, res) => {
  if (!req.body.key_name)
    return res.json({ err: 'bad_request' });

  if (!req.body.type || !KEY_TYPE_VALUES.includes(req.body.type))
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: showKeyInNodeCommand(req.body.key_name, req.body.type),
    in_container: true
  }, (err, show_key_in_node_response) => {
    if (err)
      return res.json({ err: err });

    if (INVALID_NAME_ERROR_MESSAGE_REGEX.test(show_key_in_node_response.stderr))
      return res.json({ err: 'key_not_found' });

    return res.json({ data: show_key_in_node_response.stdout });
  });
};