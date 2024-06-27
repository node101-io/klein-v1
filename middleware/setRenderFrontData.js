const setFrontDisplayStyle = require('../utils/setFrontDisplayStyle');

module.exports = (req, res, next) => {
  res.locals.setFrontDisplayStyle = setFrontDisplayStyle;

  return next();
}