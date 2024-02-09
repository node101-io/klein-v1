/*
data = {
  onClick: function(),
  title: String,
  subtitle: String,
  body: String,
  silent: Boolean,
  icon: String,
  hasReply: Boolean,
  timeoutType: 'never' || 'default',
  replyPlaceholder: String,
  sound: String,
  urgency: 'normal' || 'critical' || 'low',
  actions: [
    {
      type: 'button',
      text: String,
      onClick: function()
    }
  ],
  closeButtonText: String,
  toastXml: String
}
*/

const path = require('path');
const { Notification } = require('electron')

module.exports = (data, callback) => {
  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (data.onClick && typeof data.onClick != 'function')
    return callback('bad_request');

  const options = {};

  if (data.title && typeof data.title == 'string')
    options.title = data.title;

  if (data.subtitle && typeof data.subtitle == 'string')
    options.subtitle = data.subtitle;

  if (data.body && typeof data.body == 'string')
    options.body = data.body;

  if (data.silent && typeof data.silent == 'boolean')
    options.silent = data.silent;

  if (data.icon && typeof data.icon == 'string')
    options.icon = path.join(__dirname, '../public', data.icon);

  if (data.hasReply && typeof data.hasReply == 'boolean')
    options.hasReply = data.hasReply;

  if (data.timeoutType && (data.timeoutType == 'never' || data.timeoutType == 'default'))
    options.timeoutType = data.timeoutType;

  if (data.replyPlaceholder && typeof data.replyPlaceholder == 'string')
    options.replyPlaceholder = data.replyPlaceholder;

  if (data.sound && typeof data.sound == 'string')
    options.sound = path.join(__dirname, '../public', data.sound);

  if (data.urgency && (data.urgency == 'normal' || data.urgency == 'critical' || data.urgency == 'low'))
    options.urgency = data.urgency;

  if (data.actions && Array.isArray(data.actions)){
    options.actions = [];

    for (action of data.actions) {
      if (
        (action && typeof action == 'object') &&
        (action.type && action.type == 'button') &&
        (action.text && typeof action.text == 'string') &&
        (action.onClick && typeof action.onClick == 'function')
      )
      
      options.actions.push(action);
    };

    if (!options.actions.length)
      delete options.actions;
  };

  if (data.closeButtonText && typeof data.closeButtonText == 'string')
    options.closeButtonText = data.closeButtonText;

  if (data.toastXml && typeof data.toastXml == 'string')
    options.toastXml = data.toastXml;

  const notification = new Notification(options);

  notification.on('click', (event) => {   
    if (data.onClick) data.onClick();
  });

  notification.on('action', (event, index) => {
    options.actions[index].onClick();
  });

  notification.show();

  callback(null, data);
};