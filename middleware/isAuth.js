const AppKey = require('../utils/appKey');

module.exports = (req, res, next) => {
  // if (!req.session.APP_KEY || req.session.APP_KEY != AppKey.get()) {
  //   if (req.method == 'GET')
  //     return res.redirect('/auth');

  //   return res.json({ err: 'not_authenticated_request' });
  // };

  return next();
};