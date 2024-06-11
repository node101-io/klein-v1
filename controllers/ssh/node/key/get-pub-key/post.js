const sshRequest = require('../../../../../utils/sshRequest');

const getPubKeyOfKeyInNodeCommand = require('../../../../../commands/node/key/getPubKey');

const INVALID_NAME_ERROR_MESSAGE = 'is not a valid name or address';

module.exports = (req, res) => {
  if (!req.body.key_name)
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: getPubKeyOfKeyInNodeCommand(req.body.key_name)
  }, (err, pubkey) => {
    if (err && err.includes(INVALID_NAME_ERROR_MESSAGE))
      return res.json({ err: 'document_not_found' });

    if (err)
      return res.json({ err: err });

    return res.json({ data: pubkey });
  });
};