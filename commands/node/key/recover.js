const daemonNameCommand = require("../daemonName")();

module.exports = (key_name, mnemonic) => `
  docker exec --interactive klein-node ${daemonNameCommand} keys add ${key_name} --recover --keyring-backend test --output json <<< y <<< "${mnemonic}"
`;