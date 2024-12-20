module.exports = project => {
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
