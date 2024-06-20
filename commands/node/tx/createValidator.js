const createGasFeeFlags = require('./functions/createGasFeeFlags');

module.exports = (from_key_name, fees) => `
  $DAEMON_NAME tx staking create-validator \\
    --chain-id $CHAIN_ID \\
    --keyring-backend test \\
    --yes \\
    --output json \\
    ${createGasFeeFlags(fees)} \\
    --from ${from_key_name}
`;