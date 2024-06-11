const getDaemonNameCommand = require('../getEnvVariable')('DAEMON_NAME');

module.exports = _ => `
  docker exec --interactive klein-node ${getDaemonNameCommand} keys list --keyring-backend test --output json
`;