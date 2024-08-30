module.exports = (req, res) => {
  if (!req.session.global_current_project || !req.session.global_current_project._id)
    return res.redirect('/home');

  return res.render('index', {
    page: 'node/vote',
    title: res.__('node-vote-page-title'),
    project: req.session.global_current_project
  });
};