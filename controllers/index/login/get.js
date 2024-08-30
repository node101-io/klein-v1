const fetch = require('../../../utils/fetch');

module.exports = (req, res) => {
  if (!req.session.index_login_project_id || typeof req.session.index_login_project_id != 'string' || !req.session.index_login_project_id.trim().length)
    return res.redirect('/home');

  fetch(`https://admin.klein.run/api/projects?id=${req.session.index_login_project_id}`, {}, (err, data) => {
    if (err)
      return res.json({ error: err });

    if (!data.success)
      return res.json({ error: data.error });

    req.session.global_current_project = data.project;

    return res.render('index', {
      page: 'index/login',
      title: __('index-login-page-title'),
      project: data.project,
      index_login_will_install: req.session.index_login_will_install ? true : false
    });
  });
};
