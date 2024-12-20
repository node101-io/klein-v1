const Preferences = require('../../utils/preferences');

module.exports = (req, res) => {
  if (!req.query || !req.query.key || typeof req.query.key != "string" || !req.query.key.trim().length)
    return res.json({ err: 'bad_request' });

  Preferences.get(req.query.key, (err, value) => {
    if (err) return res.json({ err: err });

    return res.json({ data: value });
  });
};