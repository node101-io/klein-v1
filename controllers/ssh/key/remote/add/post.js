const fs = require('fs');
const path = require('path');
const sshRequest = require('../../../../../utils/sshRequest');

const addRemoteKeyCommand = require('../../../../../commands/key/remote/add');

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

    const pubkey = fs.readFileSync(pubkeyPath, 'utf8');

    sshRequest('exec', {
      host: req.body.host,
      command: addRemoteKeyCommand(pubkey)
    }, (err, data) => {
      if (err)
        return res.json({ err: err });

      return res.json({ data: data });
    });
  });
};