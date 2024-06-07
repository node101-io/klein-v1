module.exports = _ => `
  cd klein-node &&
  docker compose build --no-cache &&
  docker compose up -d
`;