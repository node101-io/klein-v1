const fetch = require('../../../utils/fetch');

module.exports = (req, res) => {
  if (!req.body.project_id || typeof req.body.project_id != 'string' || !req.body.project_id.trim().length)
    return res.json({ err: 'bad_request' });

  fetch(`https://admin.klein.run/api/projects?id=${req.body.project_id}`, {}, (err, data) => {
    if (err)
      return res.json({ err: err });

    if (!data.success)
      return res.json({ err: data.error });

    req.session.global_current_project = data.project;

    return res.json({ data: data.project });
  });
};