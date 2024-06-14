const createGasFeeFlags = require('./functions/createGasFeeFlags');

module.exports = (from_key_name, from_validator_valoper, withdraw_commission, fees) => `
  $DAEMON_NAME tx distribution withdraw-rewards ${from_validator_valoper} \\
    --chain-id $CHAIN_ID \\
    --yes \\
    --output json \\
    ${createGasFeeFlags(fees)} \\
    --from ${from_key_name} \\
    ${withdraw_commission ? '--commission' : ''}
`;