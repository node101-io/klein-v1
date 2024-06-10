const daemonNameCommand = require("../daemonName")();

module.exports = key_name => `
  docker exec --interactive klein-node ${daemonNameCommand} keys add ${key_name} --keyring-backend test --output json <<< "y"
`;