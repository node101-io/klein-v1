const createGasFeeFlags = require('./functions/createGasFeeFlags');

module.exports = (from_key_name, proposal_id, option, fees) => `
  $DAEMON_NAME tx gov vote ${proposal_id} ${option} \\
    --chain-id $CHAIN_ID \\
    --keyring-backend test \\
    --yes \\
    --output json \\
    ${createGasFeeFlags(fees)} \\
    --from ${from_key_name}
`;