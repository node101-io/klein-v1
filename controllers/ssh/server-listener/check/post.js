const sshRequest = require("../../../../utils/sshRequest");

const jsonify = require("../../../../utils/jsonify");

const checkServerListenerExistentCommand = require("../../../../commands/server-listener/checkExistent");

const versions = require("../../../../versions");

module.exports = (req, res) => {
  sshRequest('exec', {
    host: req.body.host,
    command: checkServerListenerExistentCommand()
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    data = jsonify(data);

    if (!data || data.status != 'ok')
      return res.json({ err: 'server_listener_not_running' });

    sshRequest('sftp:read_file', {
      host: req.body.host,
      path: 'server-listener/package.json'
    }, (err, data) => {
      if (err)
        return res.json({ err: err });

      data = jsonify(data);

      if (!data || data.version != versions.serverListener)
        return res.json({ err: 'server_listener_version_mismatch' });

      return res.json({ data: data });
    });
  });
};