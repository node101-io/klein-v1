module.exports = key_name => `
  $DAEMON_NAME keys show ${key_name} --keyring-backend test --address
`;