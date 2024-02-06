const fs = require('fs');
const path = require('path');
const pug = require('pug');

const tempFilePath = path.join(__dirname, '../../../../resources/temp.html');

module.exports = (pugFile, locals, callback) => {
  const htmlContent = pug.renderFile(
    path.join(__dirname, `../../views/${pugFile}.pug`),
    locals
  );

  fs.writeFile(tempFilePath, htmlContent, err => {
    if (err)
      return callback(err);

    return callback(null, tempFilePath);
  });
};