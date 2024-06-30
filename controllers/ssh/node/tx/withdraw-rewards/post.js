const sshRequest = require('../../../../../utils/sshRequest');
const evaluateTxResponseError = require('../../../../../utils/evaluateTxResponseError');
const jsonify = require('../../../../../utils/jsonify');

const withdrawRewardsCommand = require('../../../../../commands/node/tx/withdrawRewards');

const DEFAULT_TEXT_FIELD_LENGTH = 1e4;
const KEY_NOT_FOUND_ERROR_MESSAGE_REGEX = /Error: (.*?): key not found/;

module.exports = (req, res) => {
  if (!req.body.from_key_name || typeof req.body.from_key_name != 'string' || !req.body.from_key_name.trim().length || req.body.from_key_name.length > DEFAULT_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  if (!req.body.from_validator_valoper || typeof req.body.from_validator_valoper != 'string' || !req.body.from_validator_valoper.trim().length || req.body.from_validator_valoper.length > DEFAULT_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  if (!('withdraw_commission' in req.body) || typeof req.body.withdraw_commission != 'boolean')
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: withdrawRewardsCommand({
      fees: req.body.fees,
      from_key_name: req.body.from_key_name,
      from_validator_valoper: req.body.from_validator_valoper,
      withdraw_commission: req.body.withdraw_commission
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