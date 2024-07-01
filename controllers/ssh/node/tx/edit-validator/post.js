const sshRequest = require('../../../../../utils/sshRequest');
const evaluateTxResponseError = require('../../../../../utils/evaluateTxResponseError');
const jsonify = require('../../../../../utils/jsonify');

const editValidatorCommand = require('../../../../../commands/node/tx/edit-validator/default');

const DEFAULT_TEXT_FIELD_LENGTH = 1e4;
const KEY_NOT_FOUND_ERROR_MESSAGE_REGEX = /Error: (.*?): key not found/;

module.exports = (req, res) => {
  if (!req.body.from_key_name || typeof req.body.from_key_name != 'string' || !req.body.from_key_name.trim().length || req.body.from_key_name.length > DEFAULT_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: editValidatorCommand({
      commission_rate: req.body.commission_rate,
      from_key_name: req.body.from_key_name,
      identity: req.body.identity,
      moniker: req.body.moniker,
      security_contact: req.body.security_contact,
      website: req.body.website
    }),
    in_container: true
  }, (err, tx_response) => {
    if (err)
      return res.json({ err: err });

    if (KEY_NOT_FOUND_ERROR_MESSAGE_REGEX.test(tx_response))
      return res.json({ err: 'key_not_found' });

    tx_response = jsonify(tx_response);

    evaluateTxResponseError(tx_response, err => {
      if (err)
        return res.json({ err: err, data: tx_response });

      return res.json({ data: tx_response });
    });
  });
};