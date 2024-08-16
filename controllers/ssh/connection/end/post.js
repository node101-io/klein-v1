const sshRequest = require('../../../../utils/sshRequest');

module.exports = (req, res) => {
  sshRequest('disconnect', req.body, (err, data) => {
    if (err) return res.json({ err: err });

    req.session.host = null;

    return res.json({});
  });
};