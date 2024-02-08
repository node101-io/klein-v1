module.exports = (req, res) => {
  return res.render('login/index', {
    page: 'login/index',
    title: 'Dashboard',
    includes: {
      css: ['confirm', 'form', 'formPopUp', 'general', 'header', 'items', 'navbar', 'navigation', 'text'],
      js: ['createConfirm', 'createFormPopUp', 'navbarListeners', 'page', 'serverRequest']
    }
  });
};