const dotenv = require('dotenv');

const sshRequest = require('../utils/sshRequest');

dotenv.config();

jest.mock('../utils/preferences.js', _ => {
  return {
    get: key => {
      if (key == 'sshFolderPath') return 'path/to/ssh/folder';
    }
  };
});

describe('type checks', _ => {
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
});

describe('connect', _ => {
  it('should call callback with "bad_request" if type is "connect:password" and data.host is not provided', done => {
    sshRequest('connect:password', {}, (err, res) => {
      expect(err).toBe('bad_request');
      done();
    });
  });

  it('should call callback with "authentication_failed" if type is "connect:password" and host is correct but password is not', done => {
    expect(process.env.TEST_HOST).toBeTruthy();

    sshRequest('connect:password', {
      host: process.env.TEST_HOST,
      password: 'badpassword'
    }, (err, res) => {
      expect(err).toBe('authentication_failed');
      done();
    });
  }, 5000);

  it('should connect and disconnect successfully if type is "connect:password" and host and password are correct', done => {
    expect(process.env.TEST_HOST).toBeTruthy();
    expect(process.env.TEST_HOST_PASSWORD).toBeTruthy();

    sshRequest('connect:password', {
      host: process.env.TEST_HOST,
      password: process.env.TEST_HOST_PASSWORD
    }, (err, res) => {
      expect(err).toBe(null);

      sshRequest('disconnect', {
        host: process.env.TEST_HOST
      }, (err, res) => {
        expect(err).toBe(null);
        done();
      });
    });
  });

  it('should call callback with "bad_request" if type is "connect:key" and data.host is not provided', done => {
    sshRequest('connect:key', {}, (err, res) => {
      expect(err).toBe('bad_request');
      done();
    });
  });

  it('should call callback with "bad_request" if type is "connect:key" and data.path is not provided', done => {
    expect(process.env.TEST_HOST).toBeTruthy();

    sshRequest('connect:key', {
      host: process.env.TEST_HOST
    }, (err, res) => {
      expect(err).toBe('bad_request');
      done();
    });
  });

  it('should call callback with "document_not_found" if type is "connect:key" and host is correct but filename is not', done => {
    expect(process.env.TEST_HOST).toBeTruthy();

    sshRequest('connect:key', {
      host: process.env.TEST_HOST,
      filename: 'bad_filename'
    }, (err, res) => {
      expect(err).toBe('document_not_found');
      done();
    });
  });
});

describe('exec', _ => {
  it('should call callback with "bad_request" if type is "exec" and command is not provided', done => {
    sshRequest('exec', {}, (error, data) => {
      expect(error).toBe('bad_request');
      done();
    });
  });

  it('should call callback with "bad_request" if type is "exec" and host is not provided', done => {
    sshRequest('exec', {
      command: 'ls -a'
    }, (error, data) => {
      expect(error).toBe('bad_request');
      done();
    });
  });
});

describe('exec:stream', _ => {
  it('should call callback with "bad_request" if type is "exec:stream" and command is not provided', done => {
    sshRequest('exec:stream', {}, (error, data) => {
      expect(error).toBe('bad_request');
      done();
    });
  });

  it('should call callback with "bad_request" if type is "exec:stream" and host is not provided', done => {
    sshRequest('exec:stream', {
      command: 'ls -a'
    }, (error, data) => {
      expect(error).toBe('bad_request');
      done();
    });
  });
});

describe('disconnect', _ => {
  it('should call callback with "bad_request" if type is "disconnect" and host is not provided', done => {
    sshRequest('disconnect', {}, (error, data) => {
      expect(error).toBe('bad_request');
      done();
    });
  });

  it('should call callback with "bad_request" if type is "disconnect" and host is provided but not connected', done => {
    expect(process.env.TEST_HOST).toBeTruthy();

    sshRequest('disconnect', {
      host: process.env.TEST_HOST
    }, (error, data) => {
      expect(error).toBe('bad_request');
      done();
    });
  });
});