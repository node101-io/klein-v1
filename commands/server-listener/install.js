module.exports = version => `
  git clone https://github.com/node101-io/server-listener.git
  cd server-listener
  git checkout v${version}
  docker compose build --no-cache
  docker compose up -d
`;