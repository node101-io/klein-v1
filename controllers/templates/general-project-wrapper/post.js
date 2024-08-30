const path = require('path');
const pug = require('pug');

const renderProjectWrapper = pug.compileFile(path.join(__dirname, '../../../views/templates/general-project-wrapper.pug'));

const typeCheckProject = project => {
  if (!project || typeof project != 'object')
    return false;

  if (!project.image || !Array.isArray(project.image))
    return false;

  for (let i = 0; i < project.image.length; i++) {
    if (typeof project.image[i] != 'object')
      return false;

    if (!project.image[i].url || typeof project.image[i].url != 'string' || !project.image[i].url.trim().length)
      return false;
  };

  if (!project.name || typeof project.name != 'string' || !project.name.trim().length)
    return false;

  if (!project.description || typeof project.description != 'string' || !project.description.trim().length)
    return false;

  if (!project.urls || typeof project.urls != 'object')
    return false;

  if (!project._id || typeof project._id != 'string' || !project._id.trim().length)
    return false;

  return true;
};

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
