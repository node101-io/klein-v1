const sshRequest = require('../../../../utils/sshRequest');

const getDockerContainerListCommand = require('../../../../commands/docker/getContainerList');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: getDockerContainerListCommand()
  }, (err, get_container_list_response) => {
    if (err)
      return res.json({ err: err });

    if (get_container_list_response.stdout && get_container_list_response.stdout.includes('klein-node'))
      return res.json({ err: 'running_node_instance' });

    return res.json({ data: get_container_list_response.stdout });
  });
};