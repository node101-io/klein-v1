const fetch = require("../../../utils/fetch");

module.exports = (req, res) => {
  if (!req.query.project_id || typeof req.query.project_id != 'string' || !req.query.project_id.trim().length)
    return res.redirect('/home');

  fetch(`https://admin.klein.run/api/projects?id=${req.query.project_id}`, {}, (err, data) => {
    if (err)
      return res.json({ err: err });

    if (!data.success)
      return res.json({ err: data.err });

    return res.render('index', {
      page: 'index/login',
      title: 'Login',
      project: data.project,
      will_install: req.query.hasOwnProperty('install'),
      host: req.query.host
    });
  });
};