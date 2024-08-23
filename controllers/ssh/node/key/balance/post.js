const sshRequest = require('../../../../../utils/sshRequest');
const jsonify = require('../../../../../utils/jsonify');

const getKeyBalanceCommand = require('../../../../../commands/node/key/balance');

const DEFAULT_MAX_TEXT_FIELD_LENGTH = 1e4;

module.exports = (req, res) => {
  if (!req.body.key_address || typeof req.body.key_address != 'string' || !req.body.key_address.trim().length || req.body.key_address.length > DEFAULT_MAX_TEXT_FIELD_LENGTH)
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.session.last_connected_host,
    command: getKeyBalanceCommand({
      key_address: req.body.key_address
    }),
    in_container: true
  }, (err, get_key_balance_response) => {
    if (err)
      return res.json({ err: err });

    const getKeyBalanceOutput = get_key_balance_response.stdout ? jsonify(get_key_balance_response.stdout) : jsonify(get_key_balance_response.stderr);

    if (!getKeyBalanceOutput || !getKeyBalanceOutput.denom || !getKeyBalanceOutput.amount)
      return res.json({ err: 'unknown_error' });

    return res.json({ data: getKeyBalanceOutput });
  });
};
