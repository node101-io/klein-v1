const sshRequest = require('../../../../../utils/sshRequest');
const evaluateTxResponseError = require('../../../../../utils/evaluateTxResponseError');
const jsonify = require('../../../../../utils/jsonify');

const redelegateTokenCommand = require('../../../../../commands/node/tx/redelegate-token/default');
const redelegateTokenCommand_celestiatestnet3 = require('../../../../../commands/node/tx/redelegate-token/celestiatestnet3');

const DEFAULT_MAX_TEXT_FIELD_LENGTH = 1e4;
const KEY_NOT_FOUND_ERROR_MESSAGE_REGEX = /Error: (.*?): key not found/;

module.exports = (req, res) => {
  if (!req.body.amount || isNaN(req.body.amount) || Number(req.body.amount) < 0)
    return res.json({ err: 'bad_request' });

  if (!req.body.from_key_name || typeof req.body.from_key_name != 'string' || !req.body.from_key_name.trim().length || req.body.from_key_name.length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  if (!req.body.from_validator_valoper || typeof req.body.from_validator_valoper != 'string' || !req.body.from_validator_valoper.trim().length || req.body.from_validator_valoper.length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  if (!req.body.to_validator_valoper || typeof req.body.to_validator_valoper != 'string' || !req.body.to_validator_valoper.trim().length || req.body.to_validator_valoper.length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  let command;

  if (req.body.non_generic_tx_commands && Array.isArray(req.body.non_generic_tx_commands) && req.body.non_generic_tx_commands.includes('redelegate_token')) {
    if (req.body.chain_registry_identifier == 'celestiatestnet3') {
      command = redelegateTokenCommand_celestiatestnet3({
        amount: req.body.amount,
        fees: req.body.fees,
        from_key_name: req.body.from_key_name,
        from_validator_valoper: req.body.from_validator_valoper,
        to_validator_valoper: req.body.to_validator_valoper
      });
    } else {
      return res.json({ err: 'not_implemented' });
    };
  } else {
    command = redelegateTokenCommand({
      amount: req.body.amount,
      fees: req.body.fees,
      from_key_name: req.body.from_key_name,
      from_validator_valoper: req.body.from_validator_valoper,
      to_validator_valoper: req.body.to_validator_valoper
    });
  };

  sshRequest('exec', {
    host: req.body.host,
    command,
    in_container: true
  }, (err, redelegate_tx_response) => {
    if (err)
      return res.json({ err: err });

    if (KEY_NOT_FOUND_ERROR_MESSAGE_REGEX.test(redelegate_tx_response.stderr))
      return res.json({ err: 'key_not_found' });

    redelegate_tx_response.stdout = jsonify(redelegate_tx_response.stdout);

    evaluateTxResponseError(redelegate_tx_response.stdout, err => {
      if (err)
        return res.json({ err: err, data: redelegate_tx_response.stdout });

      return res.json({ data: redelegate_tx_response.stdout });
    });
  });
};