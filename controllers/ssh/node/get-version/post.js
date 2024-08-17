const sshRequest = require('../../../../utils/sshRequest');

const getNodeVersionCommand = require('../../../../commands/node/getVersion');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.session.host,
    command: getNodeVersionCommand(),
    in_container: true
  }, (err, get_node_version_response) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: get_node_version_response.stdout });
  });
};