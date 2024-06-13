module.exports = (from_key_name, to_address, amount) => `
  $DAEMON_NAME tx bank send ${from_key_name} ${to_address} ${amount}$DENOM \\
    --gas=auto \\
    --gas-prices=${0.005}$DENOM \\
    --gas-adjustment=1.4 \\
    --from ${from_key_name}
`;