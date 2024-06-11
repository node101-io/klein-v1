const getDaemonNameCommand = require('../getEnvVariable')('DAEMON_NAME');

module.exports = (key_name, mnemonic) => `
  docker exec --interactive klein-node ${getDaemonNameCommand} keys add ${key_name} --recover --keyring-backend test --output json <<< y <<< "${mnemonic}"
`;