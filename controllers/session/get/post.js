module.exports = (req, res) => {
  if (!req.body.key || typeof req.body.key != 'string' || !req.body.key.trim().length)
    return res.json({ error: 'bad_request' });

  if (!req.session[key.trim()])
    return res.json({ error: 'not_found' });

  res.json({ value: req.session[key.trim()] });
};