module.exports = pubkey => `
  touch ~/.ssh/authorized_keys &&
  echo "${pubkey}" >> ~/.ssh/authorized_keys
`;