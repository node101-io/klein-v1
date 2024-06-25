const sshRequest = require('../../../../../utils/sshRequest');
const jsonify = require('../../../../../utils/jsonify');

const listKeysInNodeCommand = require('../../../../../commands/node/key/list');
const recoverKeyInNodeCommand = require('../../../../../commands/node/key/recover');

const DUPLICATED_ADDRESS_ERROR_MESSAGE_REGEX = /Error: duplicated address created/;
const INVALID_MNEMONIC_ERROR_MESSAGE_REGEX = /Error: invalid mnemonic/;
const ABORTED_ERROR_MESSAGE_REGEX = /Error: aborted/;

module.exports = (req, res) => {
  if (!req.body.key_name || typeof req.body.key_name != 'string')
    return res.json({ err: 'bad_request' });

  if (!req.body.mnemonic || typeof req.body.mnemonic != 'string')
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: listKeysInNodeCommand(),
    in_container: true
  }, (err, key_list) => {
    if (err)
      return res.json({ err: err });

    key_list = jsonify(key_list);

    for (const key of key_list)
      if (key.name == req.body.key_name)
        return res.json({ err: 'key_name_already_exists' });

    sshRequest('exec', {
      host: req.body.host,
      command: recoverKeyInNodeCommand(req.body.key_name, req.body.mnemonic),
      in_container: true
    }, (err, key) => {
      if (err)
        return res.json({ err: err });

      if (INVALID_MNEMONIC_ERROR_MESSAGE_REGEX.test(key))
        return res.json({ err: 'invalid_mnemonic' });

      if (DUPLICATED_ADDRESS_ERROR_MESSAGE_REGEX.test(key))
        return res.json({ err: 'key_already_exists' });

      if (ABORTED_ERROR_MESSAGE_REGEX.test(key))
        return res.json({ err: 'unknown_error' });

      key = jsonify(key);

      return res.json({ data: {
        address: key.address,
        mnemonic: key.mnemonic
      }});
    });
  });
};