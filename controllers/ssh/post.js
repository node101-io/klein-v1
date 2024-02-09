const sshRequest = require('../../utils/sshRequest');

module.exports = (req, res) => {
  sshRequest(req.body.type, req.body, (error, data) => {
    if (error)
      return res.json({ success: false, error: error });

    return res.json({ success: true, data: data });
  });
};