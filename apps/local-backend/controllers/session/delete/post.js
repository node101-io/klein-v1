module.exports = (req, res) => {
  if (!req.body.keys || !Array.isArray(req.body.keys) || !req.body.keys.length)
    return res.json({ error: 'bad_request' });

  let count = 0;

  req.body.keys.forEach(key => {
    if (!key || typeof key != 'string' || !key.trim().length)
      return;

    req.session[key.trim()] = null;
    count++;
  });

  res.json({ count });
};