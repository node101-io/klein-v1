module.exports = (req, res) => {
  if (!req.session.global_current_project || !req.session.global_current_project._id)
    return res.redirect('/home');

  return res.render('index', {
    page: 'node/logs',
    title: res.__('node-logs-page-title'),
    project: req.session.global_current_project
  });
};