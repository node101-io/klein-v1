const sshRequest = require('../../../../../utils/sshRequest');
const evaluateTxRepsonseError = require('../../../../../utils/evaluateTxRepsonseError');
const jsonify = require('../../../../../utils/jsonify');

const createValidatorCommand = require('../../../../../commands/node/tx/createValidator');

const DEFAULT_TEXT_FIELD_LENGTH = 1e4;
const KEY_NOT_FOUND_ERROR_MESSAGE_REGEX = /Error: (.*?): key not found/;

module.exports = (req, res) => {
  if (!req.body.amount || isNaN(req.body.amount) || Number(req.body.amount) < 0)
    return res.json({ err: 'bad_request' });

  if (!req.body.commission_max_rate || isNaN(req.body.commission_max_rate) || Number(req.body.commission_max_rate) < 0 || Number(req.body.commission_max_rate) > 1)
    return res.json({ err: 'bad_request' });

  if (!req.body.commission_max_change_rate || isNaN(req.body.commission_max_change_rate) || Number(req.body.commission_max_change_rate) < 0 || Number(req.body.commission_max_change_rate) > 1)
    return res.json({ err: 'bad_request' });

  if (!req.body.commission_rate || isNaN(req.body.commission_rate) || Number(req.body.commission_rate) < 0 || Number(req.body.commission_rate) > 1)
    return res.json({ err: 'bad_request' });

  if (!req.body.from_key_name || typeof req.body.from_key_name != 'string' || !req.body.from_key_name.trim().length || req.body.from_key_name.length > DEFAULT_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  if (!req.body.moniker || typeof req.body.moniker != 'string' || !req.body.moniker.trim().length || req.body.moniker.length > DEFAULT_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: createValidatorCommand({
      amount: req.body.amount,
      commission_max_change_rate: req.body.commission_max_change_rate,
      commission_max_rate: req.body.commission_max_rate,
      commission_rate: req.body.commission_rate,
      details: req.body.details,
      fees: req.body.fees,
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

    if (tx_response.match(KEY_NOT_FOUND_ERROR_MESSAGE_REGEX))
      return res.json({ err: 'key_not_found' });

    tx_response = jsonify(tx_response);

    evaluateTxRepsonseError(tx_response, err => {
      if (err)
        return res.json({ err: err, data: tx_response });

      return res.json({ data: tx_response });
    });
  });
};