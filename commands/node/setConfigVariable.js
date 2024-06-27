module.exports = (variable, value) => `
  sed --in-place -e "s|^${variable} *=.*|${variable} = \\"${value}\\"|" /var/lib/docker/volumes/klein-node_klein-node-volume/_data/config/config.toml
`;