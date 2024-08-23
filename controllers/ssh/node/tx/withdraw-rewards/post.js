const sshRequest = require('../../../../../utils/sshRequest');
const evaluateTxResponseError = require('../../../../../utils/evaluateTxResponseError');
const jsonify = require('../../../../../utils/jsonify');

const withdrawRewardsCommand = require('../../../../../commands/node/tx/withdraw-rewards/default');
const withdrawRewardsCommand_celestiatestnet3 = require('../../../../../commands/node/tx/withdraw-rewards/celestiatestnet3');

const DEFAULT_MAX_TEXT_FIELD_LENGTH = 1e4;

const ACCOUNT_SEQUENCE_MISMATCH_ERROR_MESSAGE_REGEX = /account sequence mismatch/;
const KEY_NOT_FOUND_ERROR_MESSAGE_REGEX = /Error: (.*?): key not found/;

module.exports = (req, res) => {
  if (!req.body.from_key_name || typeof req.body.from_key_name != 'string' || !req.body.from_key_name.trim().length || req.body.from_key_name.length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  if (!req.body.from_validator_valoper || typeof req.body.from_validator_valoper != 'string' || !req.body.from_validator_valoper.trim().length || req.body.from_validator_valoper.length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  if (!('withdraw_commission' in req.body) || typeof req.body.withdraw_commission != 'boolean')
    return res.json({ err: 'bad_request' });

  let command;

  if (req.body.non_generic_tx_commands && Array.isArray(req.body.non_generic_tx_commands) && req.body.non_generic_tx_commands.includes('withdraw_rewards')) {
    if (req.body.chain_registry_identifier == 'celestiatestnet3') {
      command = withdrawRewardsCommand_celestiatestnet3({
        fees: req.body.fees,
        from_key_name: req.body.from_key_name,
        from_validator_valoper: req.body.from_validator_valoper,
        withdraw_commission: req.body.withdraw_commission
      });
    } else {
      return res.json({ err: 'not_implemented' });
    };
  } else {
    command = withdrawRewardsCommand({
      fees: req.body.fees,
      from_key_name: req.body.from_key_name,
      from_validator_valoper: req.body.from_validator_valoper,
      withdraw_commission: req.body.withdraw_commission
    });
  };

  sshRequest('exec', {
    host: req.session.last_connected_host,
    command,
    in_container: true
  }, (err, withdraw_rewards_response) => {
    if (err)
      return res.json({ err: err });

    if (ACCOUNT_SEQUENCE_MISMATCH_ERROR_MESSAGE_REGEX.test(withdraw_rewards_response.stderr))
      return res.json({ err: 'account_sequence_mismatch' });

    if (KEY_NOT_FOUND_ERROR_MESSAGE_REGEX.test(withdraw_rewards_response.stderr))
      return res.json({ err: 'key_not_found' });

    const withdrawRewardsOutput = jsonify(withdraw_rewards_response.stdout);

    evaluateTxResponseError(withdrawRewardsOutput?.code, err => {
      if (err)
        return res.json({ err: err, data: withdrawRewardsOutput });

      return res.json({ data: withdrawRewardsOutput });
    });
  });
};