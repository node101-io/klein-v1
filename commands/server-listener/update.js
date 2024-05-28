module.exports = version => `
  cd server-listener
  git pull
  git checkout v${version}
  npm run docker:build
  npm run docker:restart
`;