const sshRequest = require('../utils/sshRequest');

module.exports = (req, res, next) => {
  // if (!req.query.host || typeof req.query.host != 'string' || !req.query.host.length)
  //   return res.redirect('/home');

  // sshRequest('check_connection', {
  //   host: req.query.host
  // }, (err, is_connected) => {
  //   console.log(err, is_connected);
  //   if (err)
  //     return res.redirect('/home');

  //   if (!is_connected)
  //     return res.redirect('/home');

    return next();
  // });
};