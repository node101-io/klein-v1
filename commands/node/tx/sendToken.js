const createGasFeeFlags = require('./functions/createGasFeeFlags');

module.exports = data => `
  $DAEMON_NAME tx bank send ${data.from_key_name} ${data.to_address} ${data.amount}$DENOM \\
    --chain-id $CHAIN_ID \\
    --keyring-backend test \\
    --yes \\
    --output json \\
    ${createGasFeeFlags(data.fees)} \\
    --from ${data.from_key_name}
`;