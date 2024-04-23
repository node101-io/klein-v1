module.exports = version => `
  git clone git@github.com:node101-io/server-listener.git
  cd server-listener
  git checkout v${version}
  npm run docker:build
  npm run docker:run
`;