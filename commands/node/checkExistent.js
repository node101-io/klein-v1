module.exports = _ => `
  docker ps --format "{{.Names}}"
`;