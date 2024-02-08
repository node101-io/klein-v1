const SSH = require('../modules/ssh/ssh');

describe('connect', () => {
  it('should call callback with null and "Connected" on success', done => {
    SSH.connect({
      host: '144.91.93.154',
      username: 'root',
      password: 'password',
    }, (err, message) => {
      expect(err).toBeNull();
      expect(message).toBe('Connected');
      done();
    });
  });

  it('should call callback with error on failure', done => {
    SSH.connect({
      host: '144.91.93.154',
      username: 'root',
      password: 'wrongpassword',
    }, err => {
      expect(err).not.toBeNull();
      done();
    });
  });
});
