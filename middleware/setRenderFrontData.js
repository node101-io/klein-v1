const SavedServers = require('../utils/savedServers');

const setFrontDisplayStyle = require('../utils/setFrontDisplayStyle');

const ALLOWED_COLOR_THEME_LIST = ['dark', 'light'];
const DEFAULT_COLOR_THEME = 'light';
const INCLUDES = {
  css: [
    'general/general', 'general/loading',
    'index/general', 'index/home', 'index/install', 'index/login', 'index/search',
    'node/general', 'node/index',
    'partials/header'
  ],
  js: [
    'functions/localhostRequest', 'functions/generateRandomHEX', 'functions/webSocket', 'functions/nodeManager', 'functions/serverManager', 'functions/SSHKeyManager', 'functions/walletManager', 'functions/preferenceManager', 'functions/savedServersManager', 'functions/preventMultiTab', 'functions/jsonify',
    'index/home', 'index/login', 'index/header', 'index/search', 'index/node',
    'node/index'
  ]
};

module.exports = (req, res, next) => {
  SavedServers.getAll((err, saved_servers) => {
    if (err)
      return res.json({ err: err });

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
    res.locals.node = {
      image: [{}],
      urls: [{}],
      system_requirements: {}
    };
    res.locals.saved_server_list = saved_servers;
    res.locals.node_operations_list = [
      {
        title: 'Create Wallet',
        url: '/create-wallet'
      },
      {
        title: 'Wallets',
        url: '/wallets'
      },
      {
        title: 'Recover Wallet',
        url: '/recover-wallet'
      },
      {
        title: 'Create Validator',
        url: '/create-validator'
      },
      {
        title: 'Edit Validator',
        url: '/edit-validator'
      },
      {
        title: 'Withdraw Rewards',
        url: '/withdraw-rewards'
      },
      {
        title: 'Delegate',
        url: '/delegate'
      },
      {
        title: 'Redelegate',
        url: '/redelegate'
      },
      {
        title: 'Undelegate',
        url: '/undelegate'
      },
      {
        title: 'Vote',
        url: '/vote'
      },
      {
        title: 'Unjail',
        url: '/unjail'
      },
      {
        title: 'Send Token',
        url: '/send-token'
      },
      {
        title: 'Logs',
        url: '/logs'
      }
    ];
    res.locals.short_input_list = [];
    res.locals.long_input_list = [];
    res.locals.navbar_collapsed = req.session.navbar_collapsed;
    res.locals.last_connected_host = req.session.last_connected_host;

    return next();
  });
};