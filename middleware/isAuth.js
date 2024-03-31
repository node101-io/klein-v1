const AppKey = require('../utils/appKey');

module.exports = (req, res, next) => {
  if (!req.session.APPKEY || req.session.APPKEY != AppKey.get()) {
    if (req.method == 'GET')
      return res.redirect('/auth');

    return res.json({ error: 'not_authenticated_request' });
  };

  return next();
};