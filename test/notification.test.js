const notificationRequest = require('../utils/notificationRequest');

jest.mock('electron', _ => {
  return {
    Notification: class {
      constructor(options) {
        this.options = options;
      };

      show() {};

      on(event, callback) {
        if (event == 'click') {
          callback();
        };

        return this;
      };
    }
  };
});

describe('notificationRequest', _ => {
  it('should call callback with "bad_request" if data is not an object', done => {
    notificationRequest('data', (error, data) => {
      expect(error).toBe('bad_request');
      done();
    });
  });

  it('should call callback with "bad_request" if onClick is not a function', done => {
    notificationRequest({
      onClick: 'onClick'
    }, (error, data) => {
      expect(error).toBe('bad_request');
      done();
    });
  });

  it('should create a new Notification with the correct options', done => {
    const data = {
      title: 'Title',
      subtitle: 'Subtitle',
      body: 'Body',
      silent: true,
      icon: 'Icon',
      hasReply: true,
      timeoutType: 'never',
      replyPlaceholder: 'Reply Placeholder',
      sound: 'Sound',
      urgency: 'normal',
      actions: [
        {
          type: 'button',
          text: 'Text',
          onClick: _ => {}
        }
      ],
      closeButtonText: 'Close Button Text',
      toastXml: 'Toast XML'
    };

    notificationRequest(data, (error, response) => {
      expect(response).toEqual(data);
      done();
    });
  });
});