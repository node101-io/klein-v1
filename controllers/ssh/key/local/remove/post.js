const fs = require('fs');
const path = require('path');

const Preferences = require('../../../../../utils/preferences');

module.exports = (req, res) => {
  if (!req.body.filename || typeof req.body.filename != 'string' || !req.body.filename.trim().length)
    return res.json({ err: 'bad_request' });

  req.body.filename = req.body.filename.trim().replace(/\.pub$/, '');

  Preferences.get('sshFolderPath', (err, sshFolderPath) => {
    if (err)
      return res.json({ err: err });

    fs.unlink(path.join(sshFolderPath, `${req.body.filename}.pub`), err => {
      if (err && err.code == 'ENOENT') return res.json({ err: 'document_not_found' });
      if (err) return res.json({ err: err });

      fs.unlink(path.join(sshFolderPath, req.body.filename), err => {
        if (err && err.code == 'ENOENT') return res.json({ err: 'document_not_found' });
        if (err) return res.json({ err: err });

        return res.json({});
      });
    });
  });
};