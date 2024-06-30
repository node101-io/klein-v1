module.exports = _ => `
  curl $SNAPSHOT | lz4 -dc - | tar -xf - -C $HOME/klein-node-volume/data
`;