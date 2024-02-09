const notificationRequest = require('../../utils/notificationRequest');

module.exports = (req, res) => {
  notificationRequest(req.body, (error, data) => {
    if (error)
      return res.json({ success: false, error: error });

    return res.json({ success: true, data: data });
  });
};