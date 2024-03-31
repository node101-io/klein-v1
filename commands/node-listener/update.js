module.exports = version => {
  return `
    cd node-listener
    git pull
    git checkout v${version}
    npm run docker:build
    npm run docker:restart
  `;
};