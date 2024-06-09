module.exports = _ => `
  docker stop $(docker ps --quiet --filter "name=klein-node")
`;