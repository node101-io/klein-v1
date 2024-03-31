const notificationRequest = require('../../utils/notificationRequest');

module.exports = (req, res) => {
  notificationRequest(req.body, (err, data) => {
    return res.json({ err: err, data: data });
  });
};