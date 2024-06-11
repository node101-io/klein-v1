const sshRequest = require('../../../../utils/sshRequest');

const restartNodeCommand = require('../../../../commands/node/restart');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: restartNodeCommand()
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({});
  });
};