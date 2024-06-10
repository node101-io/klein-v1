const daemonNameCommand = require("../daemonName")();

module.exports = _ => `
  docker exec --interactive klein-node ${daemonNameCommand} keys list --keyring-backend test --output json
`;