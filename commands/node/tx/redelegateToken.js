const createGasFeeFlags = require('./functions/createGasFeeFlags');

module.exports = (from_key_name, from_validator_valoper, to_validator_valoper, amount, fees) => `
  $DAEMON_NAME tx staking redelegate ${from_validator_valoper} ${to_validator_valoper} ${amount}$DENOM \\
    --chain-id $CHAIN_ID \\
    --keyring-backend test \\
    --yes \\
    --output json \\
    ${createGasFeeFlags(fees)} \\
    --from ${from_key_name}
`;