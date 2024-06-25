const sshRequest = require('../../../../../utils/sshRequest');
const jsonify = require('../../../../../utils/jsonify');

const getKeyBalanceCommand = require('../../../../../commands/node/key/balance');

module.exports = (req, res) => {
  if (!req.body.key_address)
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: getKeyBalanceCommand(req.body.key_address),
    in_container: true
  }, (err, balance) => {
    if (err)
      return res.json({ err: err });

    balance = jsonify(balance);

    if (!balance || !balance.denom || !balance.amount)
      return res.json({ err: 'unknown_error' });

    return res.json({ data: balance });
  });
};