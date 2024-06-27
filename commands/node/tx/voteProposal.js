const createGasFeeFlags = require('./functions/createGasFeeFlags');

module.exports = data => `
  $DAEMON_NAME tx gov vote ${data.proposal_id} ${data.option} \\
    --chain-id $CHAIN_ID \\
    --keyring-backend test \\
    --yes \\
    --output json \\
    ${createGasFeeFlags(data.fees)} \\
    --from ${data.from_key_name}
`;