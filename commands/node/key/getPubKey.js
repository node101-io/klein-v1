const getDaemonNameCommand = require('../getEnvVariable')('DAEMON_NAME');

module.exports = key_name => `
  docker exec --interactive klein-node ${getDaemonNameCommand} keys show ${key_name} --keyring-backend test --address
`;