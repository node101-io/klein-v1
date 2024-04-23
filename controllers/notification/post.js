const notificationRequest = require('../../utils/notificationRequest');

module.exports = (req, res) => {
  notificationRequest(req.body)
    .catch(err => res.json({ err: err }))
    .then(data => res.json({ data: data }));
};