const daemonNameCommand = require("../daemonName")();

module.exports = key_name => `
  docker exec --interactive klein-node ${daemonNameCommand} keys delete ${key_name} --keyring-backend test --output json --yes
`;