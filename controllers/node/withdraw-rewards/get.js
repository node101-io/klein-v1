module.exports = (req, res) => {
  if (!req.session.global_current_project || !req.session.global_current_project._id)
    return res.redirect('/home');

  return res.render('index', {
    page: 'node/withdraw-rewards',
    title: res.__('node-withdraw-rewards-page-title'),
    project: req.session.global_current_project
  });
};