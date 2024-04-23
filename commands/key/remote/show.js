module.exports = _ => `
  touch ~/.ssh/authorized_keys &&
  cat ~/.ssh/authorized_keys
`;