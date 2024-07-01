const sshRequest = require('../../../../../utils/sshRequest');
const jsonify = require('../../../../../utils/jsonify');

const listKeysInNodeCommand = require('../../../../../commands/node/key/list');
const recoverKeyInNodeCommand = require('../../../../../commands/node/key/recover');

const ABORTED_ERROR_MESSAGE_REGEX = /Error: aborted/;
const DUPLICATED_ADDRESS_ERROR_MESSAGE_REGEX = /Error: duplicated address created/;
const INVALID_MNEMONIC_ERROR_MESSAGE_REGEX = /Error: invalid mnemonic/;
const NO_RECORDS_FOUND_MESSAGE_REGEX = /No records were found in keyring/

module.exports = (req, res) => {
  if (!req.body.key_name || typeof req.body.key_name != 'string')
    return res.json({ err: 'bad_request' });

  if (!req.body.mnemonic || typeof req.body.mnemonic != 'string')
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: listKeysInNodeCommand(),
    in_container: true
  }, (err, list_keys_in_node_response) => {
    if (err)
      return res.json({ err: err });

    list_keys_in_node_response.stdout = NO_RECORDS_FOUND_MESSAGE_REGEX.test(list_keys_in_node_response.stdout) ? [] : jsonify(list_keys_in_node_response.stdout);

    for (const key of list_keys_in_node_response.stdout)
      if (key.name == req.body.key_name)
        return res.json({ err: 'key_name_already_exists' });

    sshRequest('exec', {
      host: req.body.host,
      command: recoverKeyInNodeCommand(req.body.key_name, req.body.mnemonic),
      in_container: true
    }, (err, recover_key_in_node_response) => {
      if (err)
        return res.json({ err: err });

      if (ABORTED_ERROR_MESSAGE_REGEX.test(recover_key_in_node_response.stderr))
        return res.json({ err: 'unknown_error' });

      if (DUPLICATED_ADDRESS_ERROR_MESSAGE_REGEX.test(recover_key_in_node_response.stderr))
        return res.json({ err: 'key_already_exists' });

      if (INVALID_MNEMONIC_ERROR_MESSAGE_REGEX.test(recover_key_in_node_response.stderr))
        return res.json({ err: 'invalid_mnemonic' });

      recover_key_in_node_response.stdout = jsonify(recover_key_in_node_response.stdout);

      return res.json({ data: {
        address: recover_key_in_node_response.stdout.address,
        mnemonic: recover_key_in_node_response.stdout.mnemonic
      }});
    });
  });
};