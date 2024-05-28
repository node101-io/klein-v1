const sshRequest = require("../../../../utils/sshRequest");

const updateServerListenerCommand = require("../../../../commands/server-listener/update");

const versions = require("../../../../versions");

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: updateServerListenerCommand(versions.serverListener)
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: data });
  });
};