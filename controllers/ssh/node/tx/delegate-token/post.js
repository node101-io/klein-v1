const sshRequest = require('../../../../../utils/sshRequest');

const delegateTokenCommand = require('../../../../../commands/node/tx/delegateToken');

module.exports = (req, res) => {
  if (!req.body.from_key_name || typeof req.body.from_key_name != 'string')
    return res.json({ err: 'bad_request' });

  if (!req.body.to_validator_valoper || typeof req.body.to_validator_valoper != 'string')
    return res.json({ err: 'bad_request' });

  if (!req.body.amount || typeof req.body.amount != 'string')
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: delegateTokenCommand(req.body.from_key_name, req.body.to_validator_valoper, req.body.amount, req.body.fees),
    in_container: true
  }, (err, response) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: response });
  });
};