module.exports = _ => `
  $DAEMON_NAME keys list \\
    --keyring-backend test \\
    --output json
`;