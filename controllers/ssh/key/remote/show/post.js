const sshRequest = require('../../../../../utils/sshRequest');

module.exports = (req, res) => {
  sshRequest('sftp:read_file', {
    host: req.session.host,
    path: '.ssh/authorized_keys'
  }, (err, authorized_keys) => {
    if (err)
      return res.json({ err: err });

    authorized_keys = authorized_keys.split('\n').filter(line => line.length > 0);

    return res.json({ data: authorized_keys });
  });
};