const fs = require('fs');
const path = require('path');
const pug = require('pug');

const tempFilePath = path.join(__dirname, '../../../../resources/render/temp.html');

module.exports = (pugFile, locals, callback) => {
  const htmlContent = pug.renderFile(
    path.join(__dirname, `../../views/${pugFile}.pug`),
    locals
  );

  if (!fs.existsSync(tempFilePath))
    fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });

  fs.writeFile(tempFilePath, htmlContent, err => {
    if (err)
      return callback(err);

    return callback(null, tempFilePath);
  });
};