const getDaemonNameCommand = require('../getEnvVariable')('DAEMON_NAME');

module.exports = (key_name, new_key_name) => `
  docker exec --interactive klein-node ${getDaemonNameCommand} keys rename ${key_name} ${new_key_name} --keyring-backend test --output json --yes
`;