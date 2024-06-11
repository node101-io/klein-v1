const Preferences = require('../../utils/preferences');

module.exports = (req, res) => {
  if (!req.body || !req.body.key || typeof req.body.key != "string" || !req.body.key.trim())
    return res.json({ err: 'bad_request' });

  if (!req.body.value || !req.body.value.trim())
    return res.json({ err: 'bad_request' });

  Preferences.set(req.body.key, req.body.value, (err, value) => {
    if (err) return res.json({ err: err });

    return res.json({ data: value });
  });
};