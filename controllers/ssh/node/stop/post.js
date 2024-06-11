const sshRequest = require('../../../../utils/sshRequest');

const stopNodeCommand = require('../../../../commands/node/stop');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: stopNodeCommand()
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({});
  });
};