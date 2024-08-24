const sshRequest = require('../../../../utils/sshRequest');

const checkContainerLogsCommand = require('../../../../commands/node/checkLogs');

module.exports = (req, res) => {
  sshRequest('exec:stream', {
    host: req.session.last_connected_host,
    id: req.body.id,
    command: checkContainerLogsCommand()
  }, (err, output) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: output });
  });
};
