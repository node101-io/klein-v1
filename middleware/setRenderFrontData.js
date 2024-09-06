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
    'index/home', 'index/install',  'index/index', 'index/login', 'index/header', 'index/search', 'index/node',
    'node/index'
  ]
};
const RENT_SERVERS = {
  'PQ Hosting':'https://node101.io',
  'Contabo':'https://node101.io',
  'Vultr':'https://node101.io',
  'Digital Ocean':'https://node101.io'
};

module.exports = (req, res, next) => {
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
              type: 'single-select',
              title: res.__('unjail-fees-title'),
              placeholder: res.__('unjail-fees-placeholder'),
              choices: [
                res.__('unjail-fees-low'),
                res.__('unjail-fees-medium'),
                res.__('unjail-fees-high')
              ],
              custom_choice: {
                type: 'number',
                min: 0
              },
              default_choice: 1,
              is_required: true
            },
            {
              id: 'key-name',
              type: 'text',
              title: res.__('unjail-key-name-title'),
              placeholder: res.__('unjail-key-name-placeholder'),
              pattern: '[a-zA-Z0-9-_]{1,100}',
              is_required: true
            },
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
              id: 'name',
              type: 'text',
              title: res.__('create-wallet-name-title'),
              placeholder: res.__('create-wallet-name-placeholder'),
              pattern: '[a-zA-Z0-9-_]{1,100}',
              is_required: true
            }
          ]
        },
        {
          id: 'recover-wallet',
          short_input_list: [
            {
              id: 'phrase',
              type: 'self-multiplying-text',
              title: res.__('recover-wallet-phrase-title'),
              placeholder: res.__('recover-wallet-phrase-placeholder'),
              pattern: '[a-z]{1,100}',
              is_required: true
            }
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
              title: res.__('create-validator-amount-title'),
              placeholder: res.__('create-validator-amount-placeholder'),
              min: 1,
              is_required: true
            },
            {
              id: 'max-commission-rate',
              type: 'number',
              title: res.__('create-validator-max-commission-rate-title'),
              placeholder: res.__('create-validator-max-commission-rate-placeholder'),
              min: 0,
              max: 1,
              is_required: true
            },
            {
              id: 'max-commission-change-rate',
              type: 'number',
              title: res.__('create-validator-max-commission-change-rate-title'),
              placeholder: res.__('create-validator-max-commission-change-rate-placeholder'),
              min: 0,
              max: 1,
              is_required: true
            },
            {
              id: 'commission-rate',
              type: 'number',
              title: res.__('create-validator-commission-rate-title'),
              placeholder: res.__('create-validator-commission-rate-placeholder'),
              min: 0,
              max: 1,
              is_required: true
            },
            {
              id: 'fees',
              type: 'single-select',
              title: res.__('create-validator-fees-title'),
              placeholder: res.__('create-validator-fees-placeholder'),
              choices: [
                res.__('create-validator-fees-low'),
                res.__('create-validator-fees-medium'),
                res.__('create-validator-fees-high')
              ],
              custom_choice: {
                type: 'number',
                min: 0
              },
              default_choice: 1,
              is_required: true
            },
            {
              id: 'key-name',
              type: 'text',
              title: res.__('create-validator-key-name-title'),
              placeholder: res.__('create-validator-key-name-placeholder'),
              pattern: '[a-zA-Z0-9-_]{1,100}',
              is_required: true
            },
            {
              id: 'moniker',
              type: 'text',
              title: res.__('create-validator-moniker-title'),
              placeholder: res.__('create-validator-moniker-placeholder'),
              pattern: '[a-zA-Z0-9-_]{1,100}',
              is_required: true
            },
            {
              id: 'details',
              type: 'text',
              title: res.__('create-validator-details-title'),
              placeholder: res.__('create-validator-details-placeholder'),
              pattern: '[a-zA-Z0-9-_]{1,1000}',
              is_required: false
            },
            {
              id: 'identity',
              type: 'text',
              title: res.__('create-validator-identity-title'),
              placeholder: res.__('create-validator-identity-placeholder'),
              pattern: '[a-zA-Z0-9-_]{1,100}',
              is_required: false
            },
            {
              id: 'contact',
              type: 'url',
              title: res.__('create-validator-contact-title'),
              placeholder: res.__('create-validator-contact-placeholder'),
              is_required: false
            },
            {
              id: 'website',
              type: 'url',
              title: res.__('create-validator-website-title'),
              placeholder: res.__('create-validator-website-placeholder'),
              is_required: false
            }
          ]
        },
        {
          id: 'edit-validator',
          short_input_list: [
            {
              id: 'commission-rate',
              type: 'number',
              title: res.__('edit-validator-commission-rate-title'),
              placeholder: res.__('edit-validator-commission-rate-placeholder'),
              min: 0,
              max: 1,
              is_required: false
            },
            {
              id: 'fees',
              type: 'single-select',
              title: res.__('edit-validator-fees-title'),
              choices: [
                res.__('edit-validator-fees-low'),
                res.__('edit-validator-fees-medium'),
                res.__('edit-validator-fees-high')
              ],
              custom_choice: {
                type: 'number',
                placeholder: res.__('edit-validator-fees-placeholder'),
                min: 0
              },
              default_choice: 1,
              is_required: false
            },
            {
              id: 'key-name',
              type: 'text',
              title: res.__('edit-validator-key-name-title'),
              placeholder: res.__('edit-validator-key-name-placeholder'),
              pattern: '[a-zA-Z0-9-_]{1,100}',
              is_required: false
            },
            {
              id: 'moniker',
              type: 'text',
              title: res.__('edit-validator-moniker-title'),
              placeholder: res.__('edit-validator-moniker-placeholder'),
              pattern: '[a-zA-Z0-9-_]{1,100}',
              is_required: false
            },
            {
              id: 'details',
              type: 'text',
              title: res.__('edit-validator-details-title'),
              placeholder: res.__('edit-validator-details-placeholder'),
              pattern: '[a-zA-Z0-9-_]{1,1000}',
              is_required: false
            },
            {
              id: 'identity',
              type: 'text',
              title: res.__('edit-validator-identity-title'),
              placeholder: res.__('edit-validator-identity-placeholder'),
              pattern: '[a-zA-Z0-9-_]{1,100}',
              is_required: false
            },
            {
              id: 'contact',
              type: 'url',
              title: res.__('edit-validator-contact-title'),
              placeholder: res.__('edit-validator-contact-placeholder'),
              is_required: false
            },
            {
              id: 'website',
              type: 'url',
              title: res.__('edit-validator-website-title'),
              placeholder: res.__('edit-validator-website-placeholder'),
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
              type: 'single-select',
              title: res.__('withdraw-rewards-fees-title'),
              placeholder: res.__('withdraw-rewards-fees-placeholder'),
              choices: [
                res.__('withdraw-rewards-fees-low'),
                res.__('withdraw-rewards-fees-medium'),
                res.__('withdraw-rewards-fees-high')
              ],
              custom_choice: {
                type: 'number',
                min: 0
              },
              default_choice: 1,
              is_required: true
            },
            {
              id: 'key-name',
              type: 'text',
              title: res.__('withdraw-rewards-key-name-title'),
              placeholder: res.__('withdraw-rewards-key-name-placeholder'),
              pattern: '[a-zA-Z0-9-_]{1,100}',
              is_required: true
            },
            {
              id: 'to-valoper-address',
              type: 'text',
              title: res.__('withdraw-rewards-to-valoper-address-title'),
              placeholder: res.__('withdraw-rewards-to-valoper-address-placeholder'),
              is_required: true
            }
          ]
        }
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
      content: [
        {
          id: 'logs',
          custom_content: true
        }
      ]
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
