function jsonify(data) {
  try {
    return JSON.parse(data || null);
  } catch (err) {
    console.log(err);
    return null;
  };
}