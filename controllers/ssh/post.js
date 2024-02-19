const sshRequest = require('../../utils/sshRequest');

module.exports = (req, res) => {
  sshRequest(req.body.type, req.body, (err, data) => {
    if (err)
      return res.json({ success: false, error: err });

    return res.json({ success: true, data: data });
  });
};