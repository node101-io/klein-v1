module.exports = (variable, peers) => `
  sed -i -e "s|^${variable} *=.*|${variable} = \\"${peers}\\"|" /var/lib/docker/volumes/klein-node_klein-node-volume/_data/config/config.toml
`;