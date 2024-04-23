module.exports = _ => `
  docker stop $(docker ps -a -q --filter "name=klein-node-")
  docker rm $(docker ps -a -q --filter "name=klein-node-")
`;