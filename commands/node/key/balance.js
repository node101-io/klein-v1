module.exports = key_address => `
  $DAEMON_NAME query bank balances ${key_address} \\
    --chain-id $CHAIN_ID \\
    --output json \\
    --denom $DENOM
`;