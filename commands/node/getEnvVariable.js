module.exports = variable => `
  $(docker inspect klein-node --format '{{range .Config.Env}}{{if eq (index (split . "=") 0) "${variable}"}}{{index (split . "=") 1}}{{end}}{{end}}')
`.trim();