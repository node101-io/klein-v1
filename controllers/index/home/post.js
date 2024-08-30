const fetch = require('../../../utils/fetch');

module.exports = (req, res) => {
  fetch('https://admin.klein.run/api/projects', {}, (err, data) => {
    if (err)
      return res.json({ err: err });

    if (!data.success)
      return res.json({ err: data.error });

    req.session.projects = data.projects;

    return res.json({ data: data.projects });
  });
};
