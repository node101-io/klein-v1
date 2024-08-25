const fetch = require("../../../utils/fetch");

const RENT_SERVERS = {
  'PQ Hosting':'https://node101.io',
  'Contabo':'https://node101.io',
  'Vultr':'https://node101.io',
  'Digital Ocean':'https://node101.io'
};

module.exports = (req, res) => {
  if (!req.session.project_id || typeof req.session.project_id != 'string' || !req.session.project_id.trim().length)
    return res.redirect('/home');

  fetch(`https://admin.klein.run/api/projects?id=${req.session.project_id}`, {}, (err, data) => {
    if (err)
      return res.json({ error: err });

    if (!data.success)
      return res.json({ error: data.error });

    req.session.current_project = data.project;

    return res.render('index', {
      page: 'index/login',
      title: 'Login',
      project: data.project,
      will_install: req.query.hasOwnProperty('install'),
      host: req.query.host,
      will_install_project: req.session.will_install_project ? true : false
    });
  });
};
