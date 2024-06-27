const sshRequest = require('../../../../utils/sshRequest');

const getNodeVersionCommand = require('../../../../commands/node/getVersion');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: getNodeVersionCommand(),
    in_container: true
  }, (err, node_version) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: node_version });
  });
};