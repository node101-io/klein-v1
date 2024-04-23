const AppKey = require('../../../utils/appKey');

module.exports = (req, res) => {
  const appKey = AppKey.get();

  if (req.query.app_key && req.query.app_key == appKey)
    req.session.APP_KEY = appKey;

  if (req.session.APP_KEY && req.session.APP_KEY == appKey)
    return res.redirect('/');

  return res.render('auth/index', {
    page: 'auth/index',
    title: 'Authentication',
    includes: {
      css: ['page'],
      js: ['page', 'localhostRequest']
    }
  });
};