module.exports = pubkey => `
  touch ~/.ssh/authorized_keys &&
  sed -i '/${pubkey}/d' ~/.ssh/authorized_keys
`;