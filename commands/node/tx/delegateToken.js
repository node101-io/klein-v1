const createGasFeeFlags = require('./functions/createGasFeeFlags');

module.exports = data => `
  $DAEMON_NAME tx staking delegate ${data.to_validator_valoper.trim()} ${data.amount}$DENOM \\
    --chain-id $CHAIN_ID \\
    --keyring-backend test \\
    --yes \\
    --output json \\
    ${createGasFeeFlags(data.fees)} \\
    --from ${data.from_key_name.trim()}
`;