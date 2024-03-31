module.exports = _ => {
  return 'command -v docker &> /dev/null; echo $?';
};