const sshRequest = require('../utils/sshRequest');

module.exports = (req, res, next) => {
  return next();
  sshRequest('check_connection', {
    host: req.session.last_connected_host
  }, (err, is_connected) => {
    if (err || !is_connected)
      return res.redirect('/home');

    return next();
    // } else {
    //   if (err || !is_connected)
    //     return next();

    //   if (req.query.hasOwnProperty('install'))
    //     return res.redirect('/install?project_id=' + req.query.project_id);

    //   return next();
    // }
  });
};
