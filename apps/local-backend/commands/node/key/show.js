const BECH_TYPES = {
  account: 'acc',
  validator: 'val',
  consensus: 'cons'
};

module.exports = data => `
  $DAEMON_NAME keys show ${data.key_name} \\
    --keyring-backend test \\
    --address \\
    --bech ${BECH_TYPES[data.key_type] || BECH_TYPES.account}
`;