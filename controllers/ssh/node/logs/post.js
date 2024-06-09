const sshRequest = require("../../../../utils/sshRequest");

const checkNodeLogsCommand = require("../../../../commands/node/checkLogs");

module.exports = (req, res) => {
  sshRequest('exec:stream', {
    host: req.body.host,
    id: req.body.id,
    command: checkNodeLogsCommand()
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: data });
  });
};