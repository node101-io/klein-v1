module.exports = _ => `
  $(docker inspect klein-node --format '{{range .Config.Env}}{{if eq (index (split . "=") 0) "DAEMON_NAME"}}{{index (split . "=") 1}}{{end}}{{end}}')
`.trim();