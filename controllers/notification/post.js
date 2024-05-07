const notificationRequest = require('../../utils/notificationRequest');

module.exports = (req, res) => {
  notificationRequest(req.body, (err, data) => {
    if (err)
      return res.json({ err: err });

    return res.json({ data: data });
  });
};