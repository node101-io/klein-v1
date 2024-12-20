const fetch = require('../../../utils/fetch');

module.exports = (req, res) => {
  const queryParams = new URLSearchParams();

  if (req.body.name && typeof req.body.name == 'string' && req.body.name.trim().length)
    queryParams.append('name', req.body.name.trim());

  fetch(`https://admin.klein.run/api/projects?${queryParams.toString()}`, {}, (err, data) => {
    if (err)
      return res.json({ err: err });

    if (!data.success)
      return res.json({ err: data.error });

    return res.json({ data: data.projects });
  });
};
