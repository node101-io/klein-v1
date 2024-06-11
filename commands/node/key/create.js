const getDaemonNameCommand = require('../getEnvVariable')('DAEMON_NAME');

module.exports = key_name => `
  docker exec --interactive klein-node ${getDaemonNameCommand} keys add ${key_name} --keyring-backend test --output json <<< y
`;