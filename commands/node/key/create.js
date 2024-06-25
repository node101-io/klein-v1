module.exports = key_name => `
  $DAEMON_NAME keys add ${key_name} \\
    --keyring-backend test \\
    --output json \\
  <<< y
`;