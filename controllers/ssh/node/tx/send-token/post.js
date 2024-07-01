const sshRequest = require('../../../../../utils/sshRequest');
const evaluateTxResponseError = require('../../../../../utils/evaluateTxResponseError');
const jsonify = require('../../../../../utils/jsonify');

let sendTokenCommand = require('../../../../../commands/node/tx/send-token/default');
const sendTokenCommand_celestiatestnet3 = require('../../../../../commands/node/tx/send-token/celestiatestnet3');

const DEFAULT_TEXT_FIELD_LENGTH = 1e4;
const KEY_NOT_FOUND_ERROR_MESSAGE_REGEX = /Error: (.*?): key not found/;

module.exports = (req, res) => {
  if (!req.body.amount || isNaN(req.body.amount) || Number(req.body.amount) < 0)
    return res.json({ err: 'bad_request' });

  if (!req.body.from_key_name || typeof req.body.from_key_name != 'string' || !req.body.from_key_name.trim().length || req.body.from_key_name.length > DEFAULT_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  if (!req.body.to_address || typeof req.body.to_address != 'string' || !req.body.to_address.trim().length || req.body.to_address.length > DEFAULT_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  if (req.body.non_generic_tx_commands && Array.isArray(req.body.non_generic_tx_commands) && req.body.non_generic_tx_commands.includes('send_token')) {
    if (req.body.identifier == 'celestiatestnet3') {
      sendTokenCommand = sendTokenCommand_celestiatestnet3;
    };
  };

  sshRequest('exec', {
    host: req.body.host,
    command: sendTokenCommand({
      amount: req.body.amount,
      fees: req.body.fees,
      from_key_name: req.body.from_key_name,
      to_address: req.body.to_address
    }),
    in_container: true
  }, (err, tx_response, ) => {
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