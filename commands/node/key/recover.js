module.exports = data => `
  $DAEMON_NAME keys add ${data.key_name} \\
    --keyring-backend test \\
    --output json \\
    --recover \\
    <<< y \\
    <<< "${data.mnemonic}"
`;