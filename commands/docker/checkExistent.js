module.exports = _ => `
  command -v docker &> /dev/null
  echo $?
`;