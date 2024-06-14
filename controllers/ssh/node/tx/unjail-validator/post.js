const sshRequest = require('../../../../../utils/sshRequest');

const unjailValidatorCommand = require('../../../../../commands/node/tx/unjailValidator');

module.exports = (req, res) => {
  if (!req.body.from_key_name || typeof req.body.from_key_name != 'string')
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: unjailValidatorCommand(req.body.from_key_name, req.body.fees),
    is_container: true
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({});
  });
};