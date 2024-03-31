module.exports = _ => {
  return `top -bn1 | grep "MiB Mem" | awk '{print "{ \\"total\\": \\"" $4 "\\", \\"free\\": \\"" $6 "\\", \\"cache\\": \\"" $10 "\\" }"}'`;
};