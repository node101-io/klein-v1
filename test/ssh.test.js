const dotenv = require('dotenv');
const sshRequest = require('../utils/sshRequest');

dotenv.config();

describe('type checks', () => {
  it('should call callback with "bad_request" if type is not provided', done => {
    sshRequest(null, {}, (err, res) => {
      expect(err).toBe('bad_request');
      done();
    });
  });

  it('should call callback with "bad_request" if type is not in TYPE_VALUES', done => {
    sshRequest('bad_type', {}, (err, res) => {
      expect(err).toBe('bad_request');
      done();
    });
  });

  it('should call callback with "bad_request" if type is "connect:password" and data.host is not provided', done => {
    sshRequest('connect:password', {}, (err, res) => {
      expect(err).toBe('bad_request');
      done();
    });
  });

  it('should call callback with "bad_request" if type is "exec" and command is not provided', done => {
    sshRequest('exec', {}, (error, data) => {
      expect(error).toBe('bad_request');
      done();
    });
  });

  it('should call callback with "authentication_failed" if type is "connect:password" and host is correct but password is not', done => {
    sshRequest('connect:password', {
      host: process.env.TEST_VPS_HOST,
      password: 'badpassword'
    }, (err, res) => {
      expect(err).toBe('authentication_failed');
      done();
    });
  }, 5000);
});