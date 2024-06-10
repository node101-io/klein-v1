const daemonNameCommand = require("../daemonName")();

module.exports = (key_name, new_key_name) => `
  docker exec --interactive klein-node ${daemonNameCommand} keys rename ${key_name} ${new_key_name} --keyring-backend test --output json --yes
`;