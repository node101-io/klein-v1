const sshRequest = require('../../../../utils/sshRequest');

const jsonify = require('../../../../utils/jsonify');

const checkServerListenerExistentCommand = require('../../../../commands/server-listener/checkExistent');

const versions = require('../../../../versions');

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: checkServerListenerExistentCommand()
  }, (err, status) => {
    if (err)
      return res.json({ err: err });

    status = jsonify(status);

    if (!status || status.status != 'ok')
      return res.json({ err: 'server_listener_not_running' });

    sshRequest('sftp:read_file', {
      host: req.body.host,
      path: 'server-listener/package.json'
    }, (err, package_json) => {
      if (err)
        return res.json({ err: err });

      package_json = jsonify(package_json);

      if (!package_json || package_json.version != versions.serverListener)
        return res.json({ err: 'server_listener_version_mismatch' });

      return res.json({});
    });
  });
};