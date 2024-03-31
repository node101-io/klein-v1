module.exports = pubkey => {
  return `touch ~/.ssh/authorized_keys && sed -i '/${pubkey}/d' ~/.ssh/authorized_keys`;
}