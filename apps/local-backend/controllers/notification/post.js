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
const { Notification } = require('electron');

module.exports = (req, res) => {
  if (!req.body || typeof req.body != 'object')
    return res.json({ err: 'bad_request' });

  if (req.body.onClick && typeof req.body.onClick != 'function')
    return res.json({ err: 'bad_request' });

  const options = {};

  if (req.body.title && typeof req.body.title == 'string')
    options.title = req.body.title;

  if (req.body.subtitle && typeof req.body.subtitle == 'string')
    options.subtitle = req.body.subtitle;

  if (req.body.body && typeof req.body.body == 'string')
    options.body = req.body.body;

  if (req.body.silent && typeof req.body.silent == 'boolean')
    options.silent = req.body.silent;

  if (req.body.icon && typeof req.body.icon == 'string')
    options.icon = path.join(__dirname, '../public', req.body.icon);

  if (req.body.hasReply && typeof req.body.hasReply == 'boolean')
    options.hasReply = req.body.hasReply;

  if (req.body.timeoutType && (req.body.timeoutType == 'never' || req.body.timeoutType == 'default'))
    options.timeoutType = req.body.timeoutType;

  if (req.body.replyPlaceholder && typeof req.body.replyPlaceholder == 'string')
    options.replyPlaceholder = req.body.replyPlaceholder;

  if (req.body.sound && typeof req.body.sound == 'string')
    options.sound = path.join(__dirname, '../public', req.body.sound);

  if (req.body.urgency && (req.body.urgency == 'normal' || req.body.urgency == 'critical' || req.body.urgency == 'low'))
    options.urgency = req.body.urgency;

  if (req.body.actions && Array.isArray(req.body.actions)) {
    options.actions = [];

    for (const action of req.body.actions) {
      if (!action || typeof action != 'object')
        continue;
      if (!action.type || action.type != 'button')
        continue;
      if (!action.text || typeof action.text != 'string')
        continue;
      if (!action.onClick || typeof action.onClick != 'function')
        continue;

      options.actions.push(action);
    };

    if (!options.actions.length)
      delete options.actions;
  };

  if (req.body.closeButtonText && typeof req.body.closeButtonText == 'string')
    options.closeButtonText = req.body.closeButtonText;

  if (req.body.toastXml && typeof req.body.toastXml == 'string')
    options.toastXml = req.body.toastXml;

  const notification = new Notification(options);

  notification
    .on('click', _ => {
      if (req.body.onClick)
        req.body.onClick();
    })
    .on('action', (_, index) => {
      options.actions[index].onClick();
    })
    .show();

  return res.json({ data: req.body });
};