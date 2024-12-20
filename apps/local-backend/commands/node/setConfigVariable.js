module.exports = (variable, value) => `
  sed --in-place -e "s|^${variable} *=.*|${variable} = \\"${value}\\"|" $HOME/klein-node-volume/config/config.toml
`;