module.exports = _ => `
  docker image prune --force &> /dev/null # Clean up dangling images
  df | awk '$6 == "/" {print "{ \\"total\\": \\"" $2 "\\", \\"available\\": \\"" $4 "\\" }"}'
`;