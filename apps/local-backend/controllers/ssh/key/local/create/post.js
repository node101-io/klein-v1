const fs = require('fs');
const path = require('path');
const ssh2 = require('ssh2');

const Preferences = require('../../../../../utils/preferences');

const SSH_KEY_BITS_TO_GENERATE = 2048;
const SSH_KEY_TYPE_TO_GENERATE = 'ed25519';

module.exports = (req, res) => {
  const keyData = {
    bits: SSH_KEY_BITS_TO_GENERATE
  };

  if (req.body.passphrase && typeof req.body.passphrase == 'string' && req.body.passphrase.trim().length)
    req.body.passphrase = req.body.passphrase;

  ssh2.utils.generateKeyPair(SSH_KEY_TYPE_TO_GENERATE, keyData, (err, keys) => {
    if (err) return res.json({ err: err });

    if (!req.body.filename || typeof req.body.filename != 'string' || !req.body.filename.trim().length)
      req.body.filename = `id_${SSH_KEY_TYPE_TO_GENERATE}_${Date.now()}`;

    Preferences.get('sshFolderPath', (err, sshFolderPath) => {
      if (err) return res.json({ err: err });

      const keyPath = path.join(sshFolderPath, req.body.filename);

      fs.writeFile(keyPath, keys.private, err => {
        if (err) return res.json({ err: err });

        fs.writeFile(`${keyPath}.pub`, keys.public, err => {
          if (err) return res.json({ err: err });

          return res.json(null, { data: `${keyPath}.pub` });
        });
      });
    });
  });
};