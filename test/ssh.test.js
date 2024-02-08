const SSH = require('../modules/ssh/ssh');

test('connection to vps', () => {
  // expect(sum(1, 2)).toBe(3);
  expect(SSH.connect({
    username: 'root',
    host: '',
    password: ''
  }, (err, res) => {
    if (err)
      return false

    return true
  })).toBe(true);
});
