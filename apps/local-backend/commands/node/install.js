module.exports = _ => `
  cd klein-node &&
  BUILDKIT_PROGRESS=rawjson docker compose build --no-cache &&
  docker compose up --detach &&
  docker system prune --volumes --force
`;