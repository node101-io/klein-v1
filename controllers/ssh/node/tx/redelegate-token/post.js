const sshRequest = require('../../../../../utils/sshRequest');

const redelegateTokenCommand = require('../../../../../commands/node/tx/redelegateToken');

module.exports = (req, res) => {
  if (!req.body.from_key_name || typeof req.body.from_key_name != 'string')
    return res.json({ err: 'bad_request' });

  if (!req.body.from_validator_valoper || typeof req.body.from_validator_valoper != 'string')
    return res.json({ err: 'bad_request' });

  if (!req.body.to_validator_valoper || typeof req.body.to_validator_valoper != 'string')
    return res.json({ err: 'bad_request' });

  if (!req.body.amount || typeof req.body.amount != 'string')
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: redelegateTokenCommand(req.body.from_key_name, req.body.from_validator_valoper, req.body.to_validator_valoper, req.body.amount, req.body.fees),
    in_container: true
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({});
  });
};