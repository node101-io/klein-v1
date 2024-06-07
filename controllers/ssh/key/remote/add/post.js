const fs = require('fs');
const path = require('path');
const sshRequest = require('../../../../../utils/sshRequest');

const Preferences = require('../../../../../utils/preferences');

module.exports = (req, res) => {
  if (!req.body.filename || typeof req.body.filename != 'string' || !req.body.filename.trim().length)
    return res.json({ err: 'bad_request' });

  if (!req.body.filename.endsWith('.pub'))
    req.body.filename = req.body.filename.trim() + '.pub';

  Preferences.get('sshFolderPath', (err, sshFolderPath) => {
    if (err)
      return res.json({ err: err });

    const pubkeyPath = path.join(sshFolderPath, req.body.filename);

    if (!fs.existsSync(pubkeyPath))
      return res.json({ err: 'document_not_found' });

    fs.readFile(pubkeyPath, 'utf8', (err, pubkey) => {
      if (err)
        return res.json({ err: 'document_not_found' });

      sshRequest('sftp:append_file', {
        host: req.body.host,
        path: '.ssh/authorized_keys',
        content: pubkey
      }, (err, data) => {
        if (err)
          return res.json({ err: err });

        return res.json({});
      });
    });
  });
};