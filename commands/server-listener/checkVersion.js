module.exports = _ => `
  docker exec server-listener cat /app/package.json | jq -r .version
`;