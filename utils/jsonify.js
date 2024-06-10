module.exports = data => {
  try {
    if (!data)
      return {};

    return JSON.parse(data);
  } catch (err) {
    return {};
  };
};