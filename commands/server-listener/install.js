module.exports = version => `
  rm -rf server-listener &&
  git clone https://github.com/node101-io/server-listener.git &&
  cd server-listener &&
  git checkout v${version} &&
  docker compose build --no-cache &&
  docker compose up --detach &&
  docker system prune --volumes --force
`;