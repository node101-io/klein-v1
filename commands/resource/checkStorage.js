module.exports = _ => `
  df | awk '$6 == "/" {print "{ \\"total\\": \\"" $2 "\\", \\"available\\": \\"" $4 "\\" }"}'
`;