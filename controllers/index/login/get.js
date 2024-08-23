const fetch = require("../../../utils/fetch");

module.exports = (req, res) => {
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
      host: req.query.host,
      rent_servers: {
        'PQ Hosting':'https://node101.io',
        'Contabo':'https://node101.io',
        'Vultr':'https://node101.io',
        'Digital Ocean':'https://node101.io'
      }
    });
  });
};