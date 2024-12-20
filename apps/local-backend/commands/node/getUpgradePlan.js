module.exports = _ => `
  $DAEMON_NAME query upgrade plan \\
    --chain-id $CHAIN_ID \\
    --output json
`;