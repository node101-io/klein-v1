module.exports = version => {
  return `
    git clone git@github.com:node101-io/node-listener.git
    cd node-listener
    git checkout v${version}
    npm run docker:build
    npm run docker:run
  `;
};