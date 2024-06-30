const setFrontDisplayStyle = require('../utils/setFrontDisplayStyle');

const ALLOWED_COLOR_THEME_LIST = ['dark', 'light'];
const DEFAULT_COLOR_THEME = 'light';
const INCLUDES = {
  css: [
    'general/general',
    'index/general', 'index/home',
    'partials/header'
  ],
  js: [
    'functions/localhostRequest', 'functions/generateRandomHEX', 'functions/webSocket', 'functions/serverManager', 'functions/keyManager', 'functions/preferenceManager', 'functions/jsonify'
  ]
};

module.exports = (req, res, next) => {
  res.locals.DEFAULT_COLOR_THEME = DEFAULT_COLOR_THEME;
  res.locals.setFrontDisplayStyle = setFrontDisplayStyle;
  res.locals.color_theme = req.session.color_theme && ALLOWED_COLOR_THEME_LIST.includes(req.session.color_theme) ? req.session.color_theme : DEFAULT_COLOR_THEME;
  res.locals.includes = INCLUDES;

  return next();
}