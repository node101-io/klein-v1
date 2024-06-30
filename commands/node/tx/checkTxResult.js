module.exports = data => `
  curl --silent http://localhost:26657/tx?hash=0x${data.tx_hash}
`;