const createGasFeeFlags = require('../functions/create-gas-fee-flags/default');

module.exports = data => `
  $DAEMON_NAME tx staking unbond ${data.from_validator_valoper.trim()} ${data.amount}$DENOM \\
    --chain-id $CHAIN_ID \\
    --keyring-backend test \\
    --yes \\
    --output json \\
    ${createGasFeeFlags(data.fees)} \\
    --from ${data.from_key_name.trim()}
`;