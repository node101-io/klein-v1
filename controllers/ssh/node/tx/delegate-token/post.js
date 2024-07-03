const sshRequest = require('../../../../../utils/sshRequest');
const evaluateTxResponseError = require('../../../../../utils/evaluateTxResponseError');
const jsonify = require('../../../../../utils/jsonify');

const delegateTokenCommand = require('../../../../../commands/node/tx/delegate-token/default');
const delegateTokenCommand_celestiatestnet3 = require('../../../../../commands/node/tx/delegate-token/celestiatestnet3');

const DEFAULT_MAX_TEXT_FIELD_LENGTH = 1e4;
const KEY_NOT_FOUND_ERROR_MESSAGE_REGEX = /Error: (.*?): key not found/;

module.exports = (req, res) => {
  if (!req.body.amount || isNaN(req.body.amount) || Number(req.body.amount) < 0)
    return res.json({ err: 'bad_request' });

  if (!req.body.from_key_name || typeof req.body.from_key_name != 'string' || !req.body.from_key_name.trim().length || req.body.from_key_name.length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  if (!req.body.to_validator_valoper || typeof req.body.to_validator_valoper != 'string' || !req.body.to_validator_valoper.trim().length || req.body.to_validator_valoper.length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  let command;

  if (req.body.non_generic_tx_commands && Array.isArray(req.body.non_generic_tx_commands) && req.body.non_generic_tx_commands.includes('delegate_token')) {
    if (req.body.chain_registry_identifier == 'celestiatestnet3') {
      command = delegateTokenCommand_celestiatestnet3({
        amount: req.body.amount,
        fees: req.body.fees,
        from_key_name: req.body.from_key_name,
        to_validator_valoper: req.body.to_validator_valoper
      });
    } else {
      return res.json({ err: 'not_implemented' });
    };
  } else {
    command = delegateTokenCommand({
      amount: req.body.amount,
      fees: req.body.fees,
      from_key_name: req.body.from_key_name,
      to_validator_valoper: req.body.to_validator_valoper
    });
  };

  sshRequest('exec', {
    host: req.body.host,
    command,
    in_container: true
  }, (err, delegate_token_response) => {
    if (err)
      return res.json({ err: err });

    if (KEY_NOT_FOUND_ERROR_MESSAGE_REGEX.test(delegate_token_response.stderr))
      return res.json({ err: 'key_not_found' });

    delegate_token_response.stdout = jsonify(delegate_token_response.stdout);

    evaluateTxResponseError(delegate_token_response.stdout?.code, err => {
      if (err)
        return res.json({ err: err, data: delegate_token_response.stdout});

      return res.json({ data: delegate_token_response.stdout});
    });
  });
};