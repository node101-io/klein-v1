module.exports = (req, res) => {
  return res.render('index', {
    page: 'index/install',
    title: res.__('index-installation-page-title'),
    project: req.session.global_current_project
  });
};
