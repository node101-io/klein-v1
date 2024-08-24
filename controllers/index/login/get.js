const fetch = require("../../../utils/fetch");

module.exports = (req, res) => {
  fetch(`https://admin.klein.run/api/projects?id=${req.query.project_id}`, {}, (err, data) => {
    if (err)
      return res.json({ error: err });

    if (!data.success)
      return res.json({ error: data.error });

    return res.render('index', {
      page: 'index/login',
      title: 'Login',
      project: data.project,
      will_install: req.query.install,
      host: req.query.host
    });
  });
};