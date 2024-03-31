module.exports = _ => {
  return `
    docker stop $(docker ps -a -q --filter "name=klein-node-")
    docker rm $(docker ps -a -q --filter "name=klein-node-")
  `;
};