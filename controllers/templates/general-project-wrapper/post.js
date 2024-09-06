const path = require('path');
const pug = require('pug');

const typeCheckProject = require('../utils/typeCheckProject');

const renderProjectWrapper = pug.compileFile(path.join(__dirname, '../../../views/templates/general-project-wrapper.pug'));

module.exports = (req, res) => {
  if (!req.body || typeof req.body != 'object')
    return res.json({ err: 'bad_request' });

  if ((!req.body.project || !typeCheckProject(req.body.project)) && (!req.body.projects || !Array.isArray(req.body.projects)))
    return res.json({ err: 'bad_request' });

  if (req.body.project)
    req.body.projects = [req.body.project];

  for (let i = 0; i < req.body.projects.length; i++)
    if (!typeCheckProject(req.body.projects[i]))
      return res.json({ err: 'bad_request' });

  return res.json({
    data: req.body.projects.map(project => renderProjectWrapper({
      ...res.locals,
      project: project
    })).join('')
  });
};
