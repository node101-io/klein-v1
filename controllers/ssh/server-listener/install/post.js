const sshRequest = require("../../../../utils/sshRequest");

const installServerListenerCommand = require("../../../../commands/server-listener/install");

const versions = require("../../../../versions.json");

module.exports = (req, res) => {
  sshRequest('exec:stream', {
    host: req.body.host,
    id: req.body.id,
    command: installServerListenerCommand(versions.serverListener)
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: data });
  });
};