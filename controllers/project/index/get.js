const fetch = require('../../../utils/fetch');

module.exports = (req, res) => {
  const queryParams = new URLSearchParams();

  if (req.query.id && typeof req.query.id == 'string' && req.query.id.trim().length)
    queryParams.append('id', req.query.id.trim());
  else if (req.query.name && typeof req.query.name == 'string' && req.query.name.trim().length)
    queryParams.append('name', req.query.name.trim());

  fetch(`https://admin.klein.run/api/projects${queryParams.toString().length ? `?${queryParams.toString()}` : ''}`, {}, (err, data) => {
    console.log('search results:', err, data);
    if (err)
      return res.json({ err });

    if (!data.success)
      return res.json({ err: data.err });

    return res.json({ data: data.projects });
  });
};