const sshRequest = require('../../../../../utils/sshRequest');
const evaluateTxResponseError = require('../../../../../utils/evaluateTxResponseError');
const jsonify = require('../../../../../utils/jsonify');

const editValidatorCommand = require('../../../../../commands/node/tx/edit-validator/default');
const editValidatorCommand_celestiatestnet3 = require('../../../../../commands/node/tx/edit-validator/celestiatestnet3');

const DEFAULT_MAX_TEXT_FIELD_LENGTH = 1e4;
const KEY_NOT_FOUND_ERROR_MESSAGE_REGEX = /Error: (.*?): key not found/;

module.exports = (req, res) => {
  if (!req.body.from_key_name || typeof req.body.from_key_name != 'string' || !req.body.from_key_name.trim().length || req.body.from_key_name.length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  let command;

  if (req.body.non_generic_tx_commands && Array.isArray(req.body.non_generic_tx_commands) && req.body.non_generic_tx_commands.includes('edit_validator')) {
    if (req.body.chain_registry_identifier == 'celestiatestnet3') {
      command = editValidatorCommand_celestiatestnet3({
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
    command = editValidatorCommand({
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
  }, (err, edit_validator_response) => {
    if (err)
      return res.json({ err: err });

    if (KEY_NOT_FOUND_ERROR_MESSAGE_REGEX.test(edit_validator_response.stderr))
      return res.json({ err: 'key_not_found' });

    edit_validator_response.stdout = jsonify(edit_validator_response.stdout);

    evaluateTxResponseError(edit_validator_response.stdout?.code, err => {
      if (err)
        return res.json({ err: err, data: edit_validator_response.stdout });

      return res.json({ data: edit_validator_response.stdout });
    });
  });
};