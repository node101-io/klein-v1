const SavedServers = require('../utils/savedServers');

const setFrontDisplayStyle = require('../utils/setFrontDisplayStyle');

const ALLOWED_COLOR_THEME_LIST = ['dark', 'light'];
const DEFAULT_COLOR_THEME = 'light';
const DEFAULT_EMPTY_PROJECT = {
  image: [{}],
  urls: [{}],
  system_requirements: {}
};
const INCLUDES = {
  css: [
    'general/general', 'general/loading',
    'index/general', 'index/home', 'index/install', 'index/login', 'index/search',
    'node/general', 'node/index',
    'partials/header'
  ],
  js: [
    'functions/generateRandomHEX', 'functions/loading', 'functions/localhostRequest', 'functions/navigatePage', 'functions/webSocket', 'functions/nodeManager', 'functions/serverManager', 'functions/SSHKeyManager', 'functions/walletManager', 'functions/preferenceManager', 'functions/savedServersManager', 'functions/preventMultiTab', 'functions/jsonify',
    'index/home', 'index/login', 'index/header', 'index/search', 'index/node',
    'node/index'
  ]
};
const NODE_OPERATIONS = [
  {
    id: 'index',
    content: [
      {
        id: 'node-information',
        custom_content: true
      },
      {
        id: 'unjail',
        short_input_list: [
          {
            id: 'fees',
            type: 'text',
            title: 'Fees',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'key',
            type: 'text',
            title: 'Key Name',
            placeholder: 'Input placeholder',
            is_required: true
          }
        ]
      }
    ]
  },
  {
    id: 'wallet',
    content: [
      {
        id: 'create-wallet',
        short_input_list: [
          {
            id: 'key-name',
            type: 'text',
            title: 'Wallet Name',
            placeholder: 'An alphanumeric name for your new wallet',
            pattern: '[a-zA-Z0-9-_]{1,100}',
            is_required: true
          }
        ]
      },
      {
        id: 'recover-wallet',
        short_input_list: [
          {
            id: 'recover-phrase',
            type: 'self-multiplying-text',
            title: 'Recover Phrase',
            placeholder: 'Copy or write down your recovery phrase',
            pattern: '[a-z]{1,100}',
            is_required: true
          },
        ]
      },
      {
        id: 'wallet-list',
        custom_content: true
      }
    ]
  },
  {
    id: 'validator',
    content: [
      {
        id: 'create-validator',
        short_input_list: [
          {
            id: 'amount',
            type: 'number',
            title: 'Amount',
            placeholder: '',
            is_required: true
          },
          {
            id: 'max-commission-rate',
            type: 'number',
            title: 'Commission Max Rate',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'max-commission-change-rate',
            type: 'number',
            title: 'Commission Max Change Rate',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'commission-rate',
            type: 'number',
            title: 'Commission Rate',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'fees',
            type: 'text',
            title: 'Fees',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'key-name',
            type: 'text',
            title: 'Key Name',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'moniker',
            type: 'text',
            title: 'Moniker',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'details',
            type: 'text',
            title: 'Details',
            placeholder: 'Input placeholder',
            is_required: false
          },
          {
            id: 'identity',
            type: 'text',
            title: 'Identity',
            placeholder: 'Input placeholder',
            is_required: false
          },
          {
            id: 'contact',
            type: 'text',
            title: 'Security Contact',
            placeholder: 'Input placeholder',
            is_required: false
          },
          {
            id: 'website',
            type: 'text',
            title: 'Website',
            placeholder: 'Input placeholder',
            is_required: false
          }
        ]
      },
      {
        id: 'edit-validator',
        short_input_list: [
          {
            id: 'fees',
            type: 'text',
            title: 'Fees',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'key',
            type: 'text',
            title: 'Key Name',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'commission-rate',
            type: 'text',
            title: 'Commission Rate',
            placeholder: 'Input placeholder',
            is_required: false
          },
          {
            id: 'details',
            type: 'text',
            title: 'Details',
            placeholder: 'Input placeholder',
            is_required: false
          },
          {
            id: 'identity',
            type: 'text',
            title: 'Identity',
            placeholder: 'Input placeholder',
            is_required: false
          },
          {
            id: 'moniker',
            type: 'text',
            title: 'Moniker',
            placeholder: 'Input placeholder',
            is_required: false
          },
          {
            id: 'contact',
            type: 'text',
            title: 'Security Contact',
            placeholder: 'Input placeholder',
            is_required: false
          },
          {
            id: 'website',
            type: 'text',
            title: 'Website',
            placeholder: 'Input placeholder',
            is_required: false
          }
        ]
      }
    ]
  },
  {
    id: 'withdraw-rewards',
    content: [
      {
        id: 'withdraw-rewards',
        short_input_list: [
          {
            id: 'fees',
            type: 'text',
            title: 'Fees',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'key',
            type: 'text',
            title: 'Key Name',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'to-valoper-address',
            type: 'text',
            title: 'To Valoper Address',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'withdraw-commission',
            type: 'number',
            title: 'Withdraw Commission',
            placeholder: 'Input placeholder',
            is_required: false
          },
        ]
      },
    ]
  },
  {
    id: 'staking',
    content: [
      {
        id: 'delegate',
        short_input_list: [
          {
            id: 'amount',
            type: 'number',
            title: 'Amount',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'fees',
            type: 'text',
            title: 'Fees',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'key',
            type: 'text',
            title: 'Key Name',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'to-valoper-address',
            type: 'text',
            title: 'To Valoper Address',
            placeholder: 'Input placeholder',
            is_required: true
          }
        ],
        long_input_list: [
          {
            id: 'amount',
            type: 'number',
            title: 'Amount',
            placeholder: 'Input placeholder',
            is_required: true
          }
        ]
      },
      {
        id: 'redelegate',
        short_input_list: [
          {
            id: 'amount',
            type: 'number',
            title: 'Amount',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'fees',
            type: 'text',
            title: 'Fees',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'key',
            type: 'text',
            title: 'Key Name',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'from-valoper-address',
            type: 'text',
            title: 'From Valoper Address',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'to-valoper-address',
            type: 'text',
            title: 'To Valoper Address',
            placeholder: 'Input placeholder',
            is_required: true
          }
        ],
      },
      {
        id: 'undelegate',
        short_input_list: [
          {
            id: 'amount',
            type: 'number',
            title: 'Amount',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'fees',
            type: 'text',
            title: 'Fees',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'key',
            type: 'text',
            title: 'Key Name',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'from-valoper-address',
            type: 'text',
            title: 'From Valoper Address',
            placeholder: 'Input placeholder',
            is_required: true
          }
        ]
      }
    ]
  },
  {
    id: 'vote',
    content: [
      {
        id: 'vote',
        short_input_list: [
          {
            id: 'fees',
            type: 'text',
            title: 'Fees',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'key',
            type: 'text',
            title: 'Key Name',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'proposal-id',
            type: 'number',
            title: 'Proposal ID',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'option',
            type: 'radio',
            choices: [
              { id: 'yes', text: 'Yes' },
              { id: 'no', text: 'No' },
              { id: 'no-with-veto', text: 'No with veto' },
              { id: 'abstain', text: 'Abstain' },
            ],
            title: 'Proposal ID',
            placeholder: 'Input placeholder',
            is_required: true
          }
        ],
      }
    ]
  },
  {
    id: 'send-token',
    content: [
      {
        id: 'send-token',
        short_input_list: [
          {
            id: 'amount',
            type: 'number',
            title: 'Amount',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'fees',
            type: 'text',
            title: 'Fees',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'key',
            type: 'text',
            title: 'Key Name',
            placeholder: 'Input placeholder',
            is_required: true
          },
          {
            id: 'to-valoper-address',
            type: 'text',
            title: 'To Valoper Address',
            placeholder: 'Input placeholder',
            is_required: true
          }
        ]
      }
    ]
  },
  {
    id: 'logs',
    content: 'custom-pug'
  }
];
const NODE_OPERATIONS_MENU = [
  {
    title: 'Wallet Operations',
    url: '/wallet'
  },
  {
    title: 'Validator Operations',
    url: '/validator'
  },
  {
    title: 'Withdraw Rewards',
    url: '/withdraw-rewards'
  },
  {
    title: 'Staking Operations',
    url: '/staking'
  },
  {
    title: 'Vote',
    url: '/vote'
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
const RENT_SERVERS = {
  'PQ Hosting':'https://node101.io',
  'Contabo':'https://node101.io',
  'Vultr':'https://node101.io',
  'Digital Ocean':'https://node101.io'
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

    res.locals.project = DEFAULT_EMPTY_PROJECT;
    res.locals.node_operations = NODE_OPERATIONS;
    res.locals.node_operations_menu = NODE_OPERATIONS_MENU;
    res.locals.rent_servers = RENT_SERVERS;

    res.locals.saved_server_list = saved_servers;
    res.locals.navbar_collapsed = req.session.navbar_collapsed;
    res.locals.last_connected_host = req.session.last_connected_host;

    return next();
  });
};
