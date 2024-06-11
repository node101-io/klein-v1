const sshRequest = require('../../../../../utils/sshRequest');
const jsonify = require('../../../../../utils/jsonify');

const createKeyInNodeCommand = require('../../../../../commands/node/key/create');

module.exports = (req, res) => {
  if (!req.body.key_name)
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: createKeyInNodeCommand(req.body.key_name)
  }, (err, key) => {
    if (err)
      return res.json({ err: err });

    key = jsonify(key);

    return res.json({ data: {
      address: key.address,
      mnemonic: key.mnemonic
    }});
  });
};