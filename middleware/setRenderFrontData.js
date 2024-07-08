const setFrontDisplayStyle = require('../utils/setFrontDisplayStyle');

const ALLOWED_COLOR_THEME_LIST = ['dark', 'light'];
const DEFAULT_COLOR_THEME = 'light';
const INCLUDES = {
  css: [
    'general/general',
    'index/general', 'index/home', 'index/login', 'index/search', 'index/install',
    'partials/header'
  ],
  js: [
    'index/home', 'index/login', 'index/header', 'index/search',
    'functions/localhostRequest', 'functions/generateRandomHEX', 'functions/webSocket', 'functions/nodeManager', 'functions/serverManager', 'functions/SSHKeyManager', 'functions/walletManager', 'functions/preferenceManager', 'functions/jsonify'
  ]
};

module.exports = (req, res, next) => {
  res.locals.DEFAULT_COLOR_THEME = DEFAULT_COLOR_THEME;
  res.locals.setFrontDisplayStyle = setFrontDisplayStyle;
  res.locals.color_theme = req.session.color_theme && ALLOWED_COLOR_THEME_LIST.includes(req.session.color_theme) ? req.session.color_theme : DEFAULT_COLOR_THEME;
  res.locals.includes = INCLUDES;
  res.locals.projects = [];
  res.locals.project = {
    image: [{}],
    urls: [{}],
    system_requirements: {}
  };
  res.locals.node = {};
  res.locals.saved_ip_list = [];
  res.locals.short_input_list = [];
  res.locals.long_input_list = [];

  return next();
}