const sshRequest = require('../../../../../utils/sshRequest');
const evaluateTxResponseError = require('../../../../../utils/evaluateTxResponseError');
const jsonify = require('../../../../../utils/jsonify');

const sendTokenCommand = require('../../../../../commands/node/tx/send-token/default');
const sendTokenCommand_celestiatestnet3 = require('../../../../../commands/node/tx/send-token/celestiatestnet3');

const DEFAULT_MAX_TEXT_FIELD_LENGTH = 1e4;

const ACCOUNT_SEQUENCE_MISMATCH_ERROR_MESSAGE_REGEX = /account sequence mismatch/;
const KEY_NOT_FOUND_ERROR_MESSAGE_REGEX = /Error: (.*?): key not found/;

module.exports = (req, res) => {
  if (!req.body.amount || isNaN(req.body.amount) || Number(req.body.amount) < 0)
    return res.json({ err: 'bad_request' });

  if (!req.body.from_key_name || typeof req.body.from_key_name != 'string' || !req.body.from_key_name.trim().length || req.body.from_key_name.length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  if (!req.body.to_address || typeof req.body.to_address != 'string' || !req.body.to_address.trim().length || req.body.to_address.length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  let command;

  if (req.body.non_generic_tx_commands && Array.isArray(req.body.non_generic_tx_commands) && req.body.non_generic_tx_commands.includes('send_token')) {
    if (req.body.chain_registry_identifier == 'celestiatestnet3') {
      command = sendTokenCommand_celestiatestnet3({
        amount: req.body.amount,
        fees: req.body.fees,
        from_key_name: req.body.from_key_name,
        to_address: req.body.to_address
      });
    } else {
      return res.json({ err: 'not_implemented' });
    };
  } else {
    command = sendTokenCommand({
      amount: req.body.amount,
      fees: req.body.fees,
      from_key_name: req.body.from_key_name,
      to_address: req.body.to_address
    });
  };

  sshRequest('exec', {
    host: req.session.last_connected_host,
    command,
    in_container: true
  }, (err, send_token_response, ) => {
    if (err)
      return res.json({ err: err });

    if (ACCOUNT_SEQUENCE_MISMATCH_ERROR_MESSAGE_REGEX.test(send_token_response.stderr))
      return res.json({ err: 'account_sequence_mismatch' });

    if (KEY_NOT_FOUND_ERROR_MESSAGE_REGEX.test(send_token_response.stderr))
      return res.json({ err: 'key_not_found' })

    const sendTokenOutput = jsonify(send_token_response.stdout);

    evaluateTxResponseError(sendTokenOutput?.code, err => {
      if (err)
        return res.json({ err: err, data: sendTokenOutput });

      return res.json({ data: sendTokenOutput });
    });
  });
};
