module.exports = data => `
  $DAEMON_NAME query bank balances ${data.key_address} \\
    --chain-id $CHAIN_ID \\
    --output json \\
    --denom $DENOM
`;