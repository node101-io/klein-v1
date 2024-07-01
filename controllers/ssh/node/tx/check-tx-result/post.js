const sshRequest = require('../../../../../utils/sshRequest');
const evaluateTxResponseError = require('../../../../../utils/evaluateTxResponseError');
const jsonify = require('../../../../../utils/jsonify');

const checkTxResultCommand = require('../../../../../commands/node/tx/checkTxResult');

const DEFAULT_TEXT_FIELD_LENGTH = 1e4;
const TX_NOT_FOUND_ERROR_MESSAGE_REGEX = /tx \((.*?)\) not found/;

module.exports = (req, res) => {
  if (!req.body.tx_hash || typeof req.body.tx_hash != 'string' || !req.body.tx_hash.trim().length || req.body.tx_hash.length > DEFAULT_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: checkTxResultCommand({
      tx_hash: req.body.tx_hash
    })
  }, (err, tx_response) => {
    if (err)
      return res.json({ err: err });

    if (TX_NOT_FOUND_ERROR_MESSAGE_REGEX.test(tx_response))
      return res.json({ err: 'tx_not_found' });

    tx_response = jsonify(tx_response);

    evaluateTxResponseError(tx_response, err => {
      if (err)
        return res.json({ err: err, data: tx_response });

      return res.json({ data: tx_response });
    });
  });
};