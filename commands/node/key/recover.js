module.exports = (key_name, mnemonic) => `
  $DAEMON_NAME keys add ${key_name} --recover --keyring-backend test --output json <<< y <<< "${mnemonic}"
`;