module.exports = _ => `
  cd klein-node &&
  docker compose build --no-cache &&
  docker compose up --detach &&
  docker system prune --volumes --force
`;