const sshRequest = require('../../../../../utils/sshRequest');

module.exports = (req, res) => {
  sshRequest('sftp:read_file', {
    host: req.body.host,
    path: '~/.ssh/authorized_keys'
  }, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: data });
  });
};