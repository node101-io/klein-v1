module.exports = (req, res) => {
  return res.render('login/index', {
    page: 'login/index',
    title: 'Login',
    includes: {
      css: ['page'],
      js: ['page', 'serverRequest', 'generateRandomHEX', 'webSocket']
    }
  });
};