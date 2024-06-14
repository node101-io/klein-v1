const BECH_TYPES = {
  account: 'acc',
  validator: 'val',
  concensus: 'cons'
};

module.exports = (key_name, type) => `
  $DAEMON_NAME keys show ${key_name} \\
    --keyring-backend test \\
    --address \\
    --bech ${BECH_TYPES[type] || BECH_TYPES.account}
`;