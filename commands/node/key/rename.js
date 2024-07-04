module.exports = data => `
  $DAEMON_NAME keys rename ${data.key_name} ${data.new_key_name} \\
    --keyring-backend test \\
    --output json \\
    --yes
`;