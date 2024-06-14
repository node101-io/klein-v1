const createGasFeeFlags = require('./functions/createGasFeeFlags');

module.exports = (from_key_name, fees) => `
  $DAEMON_NAME tx slashing unjail \\
    --chain-id $CHAIN_ID \\
    --yes \\
    --output json \\
    ${createGasFeeFlags(fees)} \\
    --from ${from_key_name}
`;