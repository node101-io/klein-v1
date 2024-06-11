const sshRequest = require('../../../../utils/sshRequest');

const getDockerContainerListCommand = require('../../../../commands/docker/getContainerList');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: getDockerContainerListCommand()
  }, (err, container_list) => {
    if (err)
      return res.json({ err: err });

    if (container_list && container_list.includes('klein-node'))
      return res.json({ err: 'another_node_instance' });

    return res.json({ data: container_list });
  });
};