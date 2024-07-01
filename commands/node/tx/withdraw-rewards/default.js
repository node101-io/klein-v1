const createGasFeeFlags = require('../functions/createGasFeeFlags');

module.exports = data => `
  $DAEMON_NAME tx distribution withdraw-rewards ${data.from_validator_valoper.trim()} \\
    --chain-id $CHAIN_ID \\
    --keyring-backend test \\
    --yes \\
    --output json \\
    ${createGasFeeFlags(data.fees)} \\
    --from ${data.from_key_name.trim()} \\
    ${data.withdraw_commission ? '--commission' : ''}
`;