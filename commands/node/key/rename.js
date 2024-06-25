module.exports = (key_name, new_key_name) => `
  $DAEMON_NAME keys rename ${key_name} ${new_key_name} \\
    --keyring-backend test \\
    --output json \\
    --yes
`;