const sshRequest = require('../../../../../utils/sshRequest');
const evaluateTxResponseError = require('../../../../../utils/evaluateTxResponseError');
const jsonify = require('../../../../../utils/jsonify');

const createValidatorCommand = require('../../../../../commands/node/tx/create-validator/default');
const createValidatorCommand_celestiatestnet3 = require('../../../../../commands/node/tx/create-validator/celestiatestnet3');

const DEFAULT_MAX_TEXT_FIELD_LENGTH = 1e4;
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

  if (!req.body.from_key_name || typeof req.body.from_key_name != 'string' || !req.body.from_key_name.trim().length || req.body.from_key_name.length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  if (!req.body.moniker || typeof req.body.moniker != 'string' || !req.body.moniker.trim().length || req.body.moniker.length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  let command;

  if (req.body.non_generic_tx_commands && Array.isArray(req.body.non_generic_tx_commands) && req.body.non_generic_tx_commands.includes('create_validator')) {
    if (req.body.chain_registry_identifier == 'celestiatestnet3') {
      command = createValidatorCommand_celestiatestnet3({
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
      });
    } else {
      return res.json({ err: 'not_implemented' });
    };
  } else {
    command = createValidatorCommand({
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
    });
  };

  sshRequest('exec', {
    host: req.body.host,
    command,
    in_container: true
  }, (err, create_validator_response) => {
    if (err)
      return res.json({ err: err });

    if (KEY_NOT_FOUND_ERROR_MESSAGE_REGEX.test(create_validator_response.stderr))
      return res.json({ err: 'key_not_found' });

    create_validator_response.stdout = jsonify(create_validator_response.stdout);

    evaluateTxResponseError(create_validator_response.stdout?.code, err => {
      if (err)
        return res.json({ err: err, data: create_validator_response.stdout });

      return res.json({ data: create_validator_response.stdout });
    });
  });
};