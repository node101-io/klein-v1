module.exports = _ => `
  cd server-listener
  npm run docker:stop
  npm run docker:remove
  cd ..
  rm -rf server-listener
`;