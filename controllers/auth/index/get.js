const AppKey = require('../../../utils/appKey');

module.exports = (req, res) => {
  if (req.session.APPKEY && req.session.APPKEY == AppKey.get())
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