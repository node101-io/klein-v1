const sshRequest = require('../utils/sshRequest');

module.exports = (req, res, next) => {
  return next();
  sshRequest('check_connection', {
    host: req.session.last_connected_host
  }, (err, is_connected) => {
    console.log(err, is_connected);
    if (err)
      return res.redirect('/home');

    if (!is_connected)
      return res.redirect('/home');

    return next();
  });
};
