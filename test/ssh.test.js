const sshRequest = require('../utils/sshRequest');

// jest.mock('fs');
// jest.mock('os');
// jest.mock('path');
// jest.mock('ssh2', () => {
//   return {
//     Client: class {
//       constructor() {
//         this.events = {};
//         this.on = jest.fn((event, callback) => {
//           this.events[event] = callback;
//           return this;
//         });
//         this.connect = jest.fn((options) => {
//           if (options.password === 'bar') {
//             process.nextTick(() => this.events['error']({ level: 'client-authentication' }));
//           } else {
//             process.nextTick(() => this.events['ready']());
//           }
//         });
//         this.end = jest.fn();
//         this.exec = jest.fn((command, callback) => {
//           process.nextTick(() => {
//             const stream = { on: jest.fn(), end: jest.fn() };
//             callback(null, stream);
//           });
//         });
//       }
//     },
//     utils: {
//       parseKey: jest.fn().mockReturnValue({}),
//     },
//   };
// });

describe('sshRequest', () => {
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

  it('should call callback with "authentication_failed" if type is "connect:password" and an error occurs', done => {
    sshRequest('connect:password', {
      host: '144.91.93.154',
      password: 'badpassword'
    }, (err, res) => {
      expect(err).toBe('authentication_failed');
      done();
    });
  }, 10000);

  // it('should call callback "{ success: true }" if type is "connect:password" and host and password are provided', done => {
  //   sshRequest('connect:password', {
  //     host: '144.91.93.154',
  //     password: 'correctpassword'
  //   }, (err, res) => {
  //     expect(res).toBe({ success: true });
  //     done();
  //   });
  // }, 20000);

  // it('should call callback with "Disconnected" if type is "disconnect"', done => {
  //   sshRequest('disconnect', {}, (error, data) => {
  //     expect(data).toBe('Disconnected');
  //     done();
  //   });
  // });

  // it('should call callback with "bad_request" if type is "exec" and command is not provided', done => {
  //   sshRequest('exec', {}, (error, data) => {
  //     expect(error).toBe('bad_request');
  //     done();
  //   });
  // });
});