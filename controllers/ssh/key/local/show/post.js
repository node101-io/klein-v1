const fs = require('fs');

const Preferences = require('../../../../../utils/preferences');

module.exports = (req, res) => {
  fs.readdir(Preferences.get('sshFolderPath'), (err, files) => {
    if (err) return res.json({ err: err });

    return res.json({
      data: files.filter(file => file.endsWith('.pub'))
    });
  });
};