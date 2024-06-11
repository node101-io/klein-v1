module.exports = _ => `
  docker ps --format --all "{{.Names}}"
`;