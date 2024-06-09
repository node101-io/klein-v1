module.exports = _ => `
  docker start $(docker ps --quiet --filter "name=klein-node" --all)
`;