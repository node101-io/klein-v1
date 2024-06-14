const sshRequest = require('../../../../../utils/sshRequest');

const withdrawRewardsCommand = require('../../../../../commands/node/tx/withdrawRewards');

module.exports = (req, res) => {
  if (!req.body.from_key_name || typeof req.body.from_key_name != 'string')
    return res.json({ err: 'bad_request' });

  if (!req.body.from_validator_valoper || typeof req.body.from_validator_valoper != 'string')
    return res.json({ err: 'bad_request' });

  if (!('withdraw_commission' in req.body) || typeof req.body.withdraw_commission != 'boolean')
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: withdrawRewardsCommand(req.body.from_key_name, req.body.from_validator_valoper, req.body.withdraw_commission, req.body.fees),
    is_container: true
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({});
  });
};