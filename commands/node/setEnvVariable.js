module.exports = (variable, value) => `
  sed --in-place '/export ${variable}=/d' $HOME/.bash_profile &&
  echo "export ${variable}=${value}" >> $HOME/.bash_profile &&
  source $HOME/.bash_profile
`;