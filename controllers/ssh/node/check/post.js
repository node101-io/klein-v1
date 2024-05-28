const sshRequest = require("../../../../utils/sshRequest");

const checkNodeExistentCommand = require("../../../../commands/node/checkExistent");

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: checkNodeExistentCommand()
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    if (data && data.includes('klein-node-'))
      return res.json({ err: 'another_node_instance' });

    return res.json({ data: data });
  });
};