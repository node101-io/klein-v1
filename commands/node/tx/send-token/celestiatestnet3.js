module.exports = data => `
  $DAEMON_NAME tx bank send ${data.from_key_name.trim()} ${data.to_address.trim()} ${data.amount}$DENOM \\
    --chain-id $CHAIN_ID \\
    --keyring-backend test \\
    --yes \\
    --output json \\
    --fees ${data.fees} \\
    --gas 300000 \\
    --from ${data.from_key_name.trim()}
`;