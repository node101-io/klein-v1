const sshRequest = require('../../../../../utils/sshRequest');
const jsonify = require('../../../../../utils/jsonify');

const createKeyInNodeCommand = require('../../../../../commands/node/key/create');
const listKeysInNodeCommand = require('../../../../../commands/node/key/list');

const DEFAULT_MAX_TEXT_FIELD_LENGTH = 1e4;
const NO_RECORDS_FOUND_MESSAGE_REGEX = /No records were found in keyring/

module.exports = (req, res) => {
  if (!req.body.key_name || typeof req.body.key_name != 'string' || !req.body.key_name.trim().length || req.body.key_name.length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
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
      host: req.body.host,
      command: createKeyInNodeCommand({
        key_name: req.body.key_name
      }),
      in_container: true
    }, (err, create_key_in_node_response) => {
      if (err)
        return res.json({ err: err });

      const createKeyOutput = create_key_in_node_response.stdout ? jsonify(create_key_in_node_response.stdout) : jsonify(create_key_in_node_response.stderr);

      return res.json({ data: {
        address: createKeyOutput.address,
        mnemonic: createKeyOutput.mnemonic
      }});
    });
  });
};