const daemonNameCommand = require("../daemonName")();

module.exports = key_name => `
  docker exec --interactive klein-node ${daemonNameCommand} keys show ${key_name} --keyring-backend test --address
`;