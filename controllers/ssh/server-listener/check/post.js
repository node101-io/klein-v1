const sshRequest = require('../../../../utils/sshRequest');

const jsonify = require('../../../../utils/jsonify');

const checkServerListenerExistentCommand = require('../../../../commands/server-listener/checkExistent');
const getDockerContainerListCommand = require('../../../../commands/docker/getContainerList');

const versions = require('../../../../versions');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.session.last_connected_host,
    command: getDockerContainerListCommand()
  }, (err, get_container_list_response) => {
    if (err)
      return res.json({ err: err });

    if (!get_container_list_response.stdout || !get_container_list_response.stdout.includes('klein-server-listener'))
      return res.json({ err: 'server_listener_not_exist' });

    sshRequest('exec', {
      host: req.session.last_connected_host,
      command: checkServerListenerExistentCommand()
    }, (err, check_server_listener_response) => {
      if (err)
        return res.json({ err: err });

      check_server_listener_response.stdout = jsonify(check_server_listener_response.stdout);

      if (!check_server_listener_response.stdout || check_server_listener_response.stdout.status != 'ok')
        return res.json({ err: 'server_listener_not_running' });

      sshRequest('sftp:read_file', {
        host: req.session.last_connected_host,
        path: 'server-listener/package.json' // TODO: instead of looking at package.json, we should fetch the tag
      }, (err, package_json) => {
        if (err)
          return res.json({ err: err });

        package_json = jsonify(package_json);

        if (!package_json || package_json.version != versions.serverListener)
          return res.json({ err: 'server_listener_version_mismatch' });

        return res.json({});
      });
    });
  });
};
