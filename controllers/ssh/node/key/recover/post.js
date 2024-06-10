const sshRequest = require("../../../../../utils/sshRequest");
const jsonify = require("../../../../../utils/jsonify");

const listKeysInNodeCommand = require("../../../../../commands/node/key/list");
const recoverKeyInNodeCommand = require("../../../../../commands/node/key/recover");

const DUPLICATED_ADDRESS_ERROR_MESSAGE = 'duplicated address created';
const INVALID_MNEMONIC_ERROR_MESSAGE = 'invalid mnemonic';

module.exports = (req, res) => {
  if (!req.body.key_name)
    return res.json({ err: 'bad_request' });

  if (!req.body.mnemonic)
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: listKeysInNodeCommand()
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    data = jsonify(data);

    for (const key of data)
      if (key.name == req.body.key_name)
        return res.json({ err: 'document_already_exists' });

    sshRequest('exec', {
      host: req.body.host,
      command: recoverKeyInNodeCommand(req.body.key_name, req.body.mnemonic)
    }, (err, data) => {
      if (err && err.includes(DUPLICATED_ADDRESS_ERROR_MESSAGE))
        return res.json({ err: 'document_already_exists' });

      if (err && err.includes(INVALID_MNEMONIC_ERROR_MESSAGE))
        return res.json({ err: 'invalid_mnemonic' });

      return res.json({});
    });
  });
};