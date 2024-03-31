const sshRequest = require("../../../../utils/sshRequest");

const removeNodeCommand = require("../../../../commands/node/remove");

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: removeNodeCommand()
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: data });
  });
};