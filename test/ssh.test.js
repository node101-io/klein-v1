const sshRequest = require('../utils/sshRequest');

jest.mock('fs');

jest.mock('os');

jest.mock('path');

jest.mock('ssh2', () => {
  return {
    Client: class {
      constructor() {
        this.on = jest.fn().mockImplementation((event, callback) => {
          if (event === 'ready') {
            process.nextTick(callback);
          }
          return this;
        });
        this.connect = jest.fn().mockImplementation(() => {});
        this.end = jest.fn();
      }
      exec(command, callback) {
        process.nextTick(() => {
          callback(null, { on: jest.fn(), end: jest.fn() });
        });
      }
    },
    utils: {
      parseKey: jest.fn().mockReturnValue({}),
    },
  };
});

describe('sshRequest', () => {
  it('should call callback with "bad_request" if type is not provided', done => {
    sshRequest(null, {}, (error, data) => {
      expect(error).toBe('bad_request');
      done();
    });
  });

  it('should call callback with "bad_request" if type is not a string', done => {
    sshRequest(1, {}, (error, data) => {
      expect(error).toBe('bad_request');
      done();
    });
  });

  it('should call callback with "bad_request" if type is not in TYPE_VALUES', done => {
    sshRequest('bad_type', {}, (error, data) => {
      expect(error).toBe('bad_request');
      done();
    });
  });

  it('should call callback with "bad_request" if data is not provided', done => {
    sshRequest('connect', null, (error, data) => {
      expect(error).toBe('bad_request');
      done();
    });
  });

  it('should call callback with "bad_request" if data is not an object', done => {
    sshRequest('connect', 'data', (error, data) => {
      expect(error).toBe('bad_request');
      done();
    });
  });

  it('should call callback with "bad_request" if type is "connect" and data.host is not provided', done => {
    sshRequest('connect', {}, (error, data) => {
      expect(error).toBe('bad_request');
      done();
    });
  });

  it('should call callback with "Connected" if type is "connect" and only host is provided', done => {
    sshRequest('connect', {
      host: '144.91.93.154'
    }, (error, data) => {
      expect(data).toBe('Connected');
      done();
    });
  });

  it('should call callback "Connected" if type is "connect" and host and password are provided', done => {
    sshRequest('connect', {
      host: '144.91.93.154',
      password: 'foo'
    }, (error, data) => {
      expect(data).toBe('Connected');
      done();
    });
  });

  it('should call callback with "Disconnected" if type is "disconnect"', done => {
    sshRequest('disconnect', {}, (error, data) => {
      expect(data).toBe('Disconnected');
      done();
    });
  });

  it('should call callback with "bad_request" if type is "exec" and command is not provided', done => {
    sshRequest('exec', {}, (error, data) => {
      expect(error).toBe('bad_request');
      done();
    });
  });
});