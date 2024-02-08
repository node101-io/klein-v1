module.exports = (req, res) => {
  return res.render('node/index', {
    page: 'node/index',
    title: 'Dashboard',
    includes: {
      css: ['confirm', 'form', 'formPopUp', 'general', 'header', 'items', 'navbar', 'navigation', 'text'],
      js: ['createConfirm', 'createFormPopUp', 'navbarListeners', 'page', 'serverRequest']
    }
  });
};