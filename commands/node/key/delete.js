module.exports = key_name => `
  $DAEMON_NAME keys delete ${key_name} \\
    --keyring-backend test \\
    --output json \\
    --yes
`;