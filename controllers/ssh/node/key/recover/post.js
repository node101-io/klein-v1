const sshRequest = require('../../../../../utils/sshRequest');
const jsonify = require('../../../../../utils/jsonify');

const listKeysInNodeCommand = require('../../../../../commands/node/key/list');
const recoverKeyInNodeCommand = require('../../../../../commands/node/key/recover');

const ABORTED_ERROR_MESSAGE_REGEX = /Error: aborted/;
const DEFAULT_MAX_TEXT_FIELD_LENGTH = 1e4;
const DUPLICATED_ADDRESS_ERROR_MESSAGE_REGEX = /Error: duplicated address created/;
const INVALID_MNEMONIC_ERROR_MESSAGE_REGEX = /Error: invalid mnemonic/;
const NO_RECORDS_FOUND_MESSAGE_REGEX = /No records were found in keyring/

module.exports = (req, res) => {
  if (!req.body.key_name || typeof req.body.key_name != 'string' || !req.body.key_name.trim().length || req.body.key_name.length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  if (!req.body.mnemonic || typeof req.body.mnemonic != 'string')
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.session.last_connected_host,
    command: listKeysInNodeCommand(),
    in_container: true
  }, (err, list_keys_in_node_response) => {
    if (err)
      return res.json({ err: err });

    const listKeysOutput = NO_RECORDS_FOUND_MESSAGE_REGEX.test(list_keys_in_node_response.stderr) || NO_RECORDS_FOUND_MESSAGE_REGEX.test(list_keys_in_node_response.stdout) ? [] : jsonify(list_keys_in_node_response.stdout);

    for (const key of listKeysOutput)
      if (key.name == req.body.key_name)
        return res.json({ err: 'key_name_already_exists' });

    sshRequest('exec', {
      host: req.session.last_connected_host,
      command: recoverKeyInNodeCommand({
        key_name: req.body.key_name,
        mnemonic: req.body.mnemonic
      }),
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

      const recoverKeyOutput = recover_key_in_node_response.stdout ? jsonify(recover_key_in_node_response.stdout) : jsonify(recover_key_in_node_response.stderr);

      return res.json({ data: {
        address: recoverKeyOutput.address
      }});
    });
  });
};
