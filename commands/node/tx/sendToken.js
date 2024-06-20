const createGasFeeFlags = require('./functions/createGasFeeFlags');

module.exports = (from_key_name, to_address, amount, fees) => `
  $DAEMON_NAME tx bank send ${from_key_name} ${to_address} ${amount}$DENOM \\
    --chain-id $CHAIN_ID \\
    --keyring-backend test \\
    --yes \\
    --output json \\
    ${createGasFeeFlags(fees)} \\
    --from ${from_key_name}
`;