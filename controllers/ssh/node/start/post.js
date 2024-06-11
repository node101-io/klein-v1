const sshRequest = require('../../../../utils/sshRequest');

const startNodeCommand = require('../../../../commands/node/start');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: startNodeCommand()
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({});
  });
};