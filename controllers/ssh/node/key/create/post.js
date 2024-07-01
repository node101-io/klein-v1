const sshRequest = require('../../../../../utils/sshRequest');
const jsonify = require('../../../../../utils/jsonify');

const createKeyInNodeCommand = require('../../../../../commands/node/key/create');

module.exports = (req, res) => {
  if (!req.body.key_name)
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: createKeyInNodeCommand(req.body.key_name),
    in_container: true
  }, (err, create_key_in_node_response) => {
    if (err)
      return res.json({ err: err });

    create_key_in_node_response.stdout = jsonify(create_key_in_node_response.stdout);

    return res.json({ data: {
      address: create_key_in_node_response.stdout.address,
      mnemonic: create_key_in_node_response.stdout.mnemonic
    }});
  });
};