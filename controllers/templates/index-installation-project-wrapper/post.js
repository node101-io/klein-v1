const path = require('path');
const pug = require('pug');

const typeCheckProject = require('../utils/typeCheckProject');

const renderProjectWrapper = pug.compileFile(path.join(__dirname, '../../../views/templates/index-installation-project-wrapper.pug'));

module.exports = (req, res) => {
  if (!req.body || typeof req.body != 'object')
    return res.json({ err: 'bad_request' });

  if (!req.body.project || !typeCheckProject(req.body.project))
    return res.json({ err: 'bad_request' });

  return res.json({
    data: renderProjectWrapper({
      ...res.locals,
      project: req.body.project
    })
  });
};
