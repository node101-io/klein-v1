const sshRequest = require('../../../../../utils/sshRequest');
const evaluateTxResponseError = require('../../../../../utils/evaluateTxResponseError');
const jsonify = require('../../../../../utils/jsonify');

const unjailValidatorCommand = require('../../../../../commands/node/tx/unjail-validator/default');
const unjailValidatorCommand_celestiatestnet3 = require('../../../../../commands/node/tx/unjail-validator/celestiatestnet3');

const DEFAULT_MAX_TEXT_FIELD_LENGTH = 1e4;
const KEY_NOT_FOUND_ERROR_MESSAGE_REGEX = /Error: (.*?): key not found/;

module.exports = (req, res) => {
  if (!req.body.from_key_name || typeof req.body.from_key_name != 'string' || !req.body.from_key_name.trim().length || req.body.from_key_name.length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  let command;

  if (req.body.non_generic_tx_commands && Array.isArray(req.body.non_generic_tx_commands) && req.body.non_generic_tx_commands.includes('unjail_validator')) {
    if (req.body.chain_registry_identifier == 'celestiatestnet3') {
      command = unjailValidatorCommand_celestiatestnet3({
        fees: req.body.fees,
        from_key_name: req.body.from_key_name
      });
    } else {
      return res.json({ err: 'not_implemented' });
    };
  } else {
    command = unjailValidatorCommand({
      fees: req.body.fees,
      from_key_name: req.body.from_key_name
    });
  };

  sshRequest('exec', {
    host: req.body.host,
    command,
    in_container: true
  }, (err, unjail_validator_response) => {
    if (err)
      return res.json({ err: err });

    if (KEY_NOT_FOUND_ERROR_MESSAGE_REGEX.test(unjail_validator_response.stderr))
      return res.json({ err: 'key_not_found' });

    unjail_validator_response.stdout = jsonify(unjail_validator_response.stdout);

    evaluateTxResponseError(unjail_validator_response.stdout, err => {
      if (err)
        return res.json({ err: err, data: unjail_validator_response.stdout });

      return res.json({ data: unjail_validator_response.stdout });
    });
  });
};