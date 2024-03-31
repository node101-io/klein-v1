const sshRequest = require('../../../../../utils/sshRequest');

const showRemoteKeyCommand = require('../../../../../commands/key/remote/show');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: showRemoteKeyCommand()
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: data });
  });
};