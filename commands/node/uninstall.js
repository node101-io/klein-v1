module.exports = _ => `
  cd klein-node &&
  docker compose down --volumes --remove-orphans --rmi all &&
  cd .. &&
  rm -rf klein-node
`;