const electron = require('electron');

const AppKey = require('../../../utils/appKey');

module.exports = (req, res) => {
  if (!req.body || !req.body.appKey || req.body.appKey != AppKey.get())
    return res.json({ err: 'bad_request' });

  if (electron.clipboard.readText() == req.body.appKey)
    electron.clipboard.clear();

  req.session.APP_KEY = req.body.appKey;

  return res.json({ err: null });
};