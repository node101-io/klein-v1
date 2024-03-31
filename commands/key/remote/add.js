module.exports = pubkey => {
  return `touch ~/.ssh/authorized_keys && echo "${pubkey}" >> ~/.ssh/authorized_keys`;
};