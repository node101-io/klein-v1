module.exports = _ => {
  return `
    cd node-listener
    npm run docker:stop
    npm run docker:remove
    cd ..
    rm -rf node-listener
  `;
};