const fetch = require('../../../utils/fetch');

module.exports = (req, res) => {
  fetch(`https://admin.klein.run/api/projects${req.query.id && typeof req.query.id == "string" && req.query.id.trim().length ? `?id=${req.query.id.trim()}` : ''}`, {}, (err, data) => {
    if (err)
      return res.json({ err: err });

    if (!data.success)
      return res.json({ err: data.err });

    return res.render('index', {
      page: 'index/home',
      title: 'Home',
      projects: data.projects
    });
  });
};