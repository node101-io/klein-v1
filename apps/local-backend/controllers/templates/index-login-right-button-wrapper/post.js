const path = require('path');
const pug = require('pug');

const renderProjectWrapper = pug.compileFile(path.join(__dirname, '../../../views/templates/index-login-right-button-wrapper.pug'));

module.exports = (req, res) => {
  if (!req.body || typeof req.body != 'object')
    return res.json({ err: 'bad_request' });

  if ((!('will_install' in req.body) || typeof req.body.will_install != 'boolean'))
    return res.json({ err: 'bad_request' });

  return res.json({
    data: renderProjectWrapper({
      ...res.locals,
      will_install: req.body.will_install
    })
  });
};
