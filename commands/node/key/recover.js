module.exports = (key_name, mnemonic) => `
  $DAEMON_NAME keys add ${key_name} \\
    --keyring-backend test \\
    --output json \\
    --recover \\
    <<< y \\
    <<< "${mnemonic}"
`;