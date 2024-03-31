module.exports = _ => {
  return `df | awk '$6 == "/" {print "{ \\"total\\": \\"" $2 "\\", \\"available\\": \\"" $4 "\\" }"}'`;
};