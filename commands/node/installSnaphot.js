const getSnapshotCommand = require('./getEnvVariable')('SNAPSHOT');

module.exports = _ => `
  curl ${getSnapshotCommand} | lz4 -dc - | tar -xf - -C /var/lib/docker/volumes/klein-node_klein-node-volume/_data/data
`;