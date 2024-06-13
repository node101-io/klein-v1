const sshRequest = require('../../../../../utils/sshRequest');

const createValidatorCommand = require('../../../../../commands/node/tx/createValidator');

module.exports = (req, res) => {
  // if (!req.body.seeds || !Array.isArray(req.body.seeds))
  //   return res.json({ err: 'bad_request' });

  sshRequest('exec', {
    host: req.body.host,
    command: createValidatorCommand()
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({});
  });
};