const fetch = require('../../../utils/fetch');

module.exports = (req, res) => {
  fetch(`https://admin.klein.run/api/projects`, {}, (err, data) => {
    if (err) return res.json({ err: err });

    if (!data.success)
      return res.json({ err: data.err });

    return res.render('index', {
      page: 'index/search',
      title: 'Search',
      projects: data.projects
    });
  });
};
