const sshRequest = require('../../../../../utils/sshRequest');

const sendTokenCommand = require('../../../../../commands/node/tx/sendToken');

module.exports = (req, res) => {
  if (!req.body.from_key_name || typeof req.body.from_key_name != 'string')
    return res.json({ err: 'bad_request' });

  if (!req.body.to_address || typeof req.body.to_address != 'string')
    return res.json({ err: 'bad_request' });

  if (!req.body.amount || typeof req.body.amount != 'string')
    return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: sendTokenCommand(req.body.from_key_name, req.body.to_address, req.body.amount)
  }, (err, response) => {
    if (err)
      return res.json({ err });

    return res.json({ data: response });
  });
};