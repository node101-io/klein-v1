const createGasFeeFlags = require('../functions/create-gas-fee-flags/celestiatestnet3');

module.exports = data => `
  $DAEMON_NAME tx gov vote ${data.proposal_id.trim()} ${data.option} \\
    --chain-id $CHAIN_ID \\
    --keyring-backend test \\
    --yes \\
    --output json \\
    ${createGasFeeFlags(data.fees)} \\
    --from ${data.from_key_name.trim()}
`;