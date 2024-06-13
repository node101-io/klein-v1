module.exports = _ => `
  docker ps --all --format "{{.Names}}"
`;