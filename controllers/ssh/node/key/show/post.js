const sshRequest = require('../../../../../utils/sshRequest');

const showKeyInNodeCommand = require('../../../../../commands/node/key/show');

const INVALID_NAME_ERROR_MESSAGE = 'is not a valid name or address';
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
  }, (err, pubkey) => {
    if (err && err.includes(INVALID_NAME_ERROR_MESSAGE))
      return res.json({ err: 'document_not_found' });

    if (err)
      return res.json({ err: err });

    return res.json({ data: pubkey });
  });
};