module.exports = _ => `
  cd server-listener
  docker compose down --volumes --remove-orphans --rmi all
  cd ..
  rm -rf server-listener
`;