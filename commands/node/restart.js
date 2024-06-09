module.exports = _ => `
  docker restart $(docker ps --quiet --filter "name=klein-node" --all)
`;