const sshRequest = require('../../../../../utils/sshRequest');
const jsonify = require('../../../../../utils/jsonify');

const listKeysInNodeCommand = require('../../../../../commands/node/key/list');

const NO_RECORDS_FOUND_MESSAGE_REGEX = /No records were found in keyring/

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: listKeysInNodeCommand(),
    in_container: true
  }, (err, list_keys_in_node_response) => {
    if (err)
      return res.json({ err: err });

    if (NO_RECORDS_FOUND_MESSAGE_REGEX.test(list_keys_in_node_response.stderr))
      return res.json({ data: [] });

    list_keys_in_node_response.stdout = jsonify(list_keys_in_node_response.stdout);

    return res.json({ data: list_keys_in_node_response.stdout });
  });
};