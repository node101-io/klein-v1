const createGasFeeFlags = require('./functions/createGasFeeFlags');

module.exports = (from_key_name, to_validator_valoper, amount, fees) => `
  $DAEMON_NAME tx staking delegate ${to_validator_valoper} ${amount}$DENOM \\
    --chain-id $CHAIN_ID \\
    --yes \\
    --output json \\
    ${createGasFeeFlags(fees)} \\
    --from ${from_key_name}
`;