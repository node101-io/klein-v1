module.exports = _ => {
  return 'docker exec node-listener cat /app/package.json | jq -r .version';
};