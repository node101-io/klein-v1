const async = require('async');
const fs = require('fs');
const Cron = require('croner');
const path = require('path');
const { app } = require('electron');

const fetch = require('./fetch');

const CHECK_NOTIFICATIONS_INTERVAL_IN_MINUTES = 5;

const notificationsPath = path.join(app.getPath('userData'), 'notifications.json');

const getLocalNotifications = callback => {
  let localNotifications = [];
  let isLocalNotificationsInitialized = true;

  try {
    localNotifications = require(notificationsPath);
  } catch (err) {
    isLocalNotificationsInitialized = false;
  };

  if (!isLocalNotificationsInitialized)
    getNotificationsFromAPI((err, notifications) => {
      if (err) return callback(err);

      Notifications.set(notifications, err => {
        if (err) return callback(err);

        return callback(null, notifications);
      });
    });
  else if (!Array.isArray(localNotifications))
    Notifications.set([], err => {
      if (err) return callback(err);

      return callback(null, []);
    });
  else
    return callback(null, localNotifications);
};

const getNotificationsFromAPI = callback => {
  fetch('https://admin.klein.run/api/notifications', {}, (err, res) => {
    if (err) return callback(err);

    if (!res.success || !res.notifications || !Array.isArray(res.notifications))
      return callback('unknown_error');

    return callback(null, res.notifications);
  });
};

const Notifications = {
  init: callback => {
    getLocalNotifications((err, notifications) => {
      if (err) return callback(err);

      Cron(`*/${CHECK_NOTIFICATIONS_INTERVAL_IN_MINUTES} * * * *`, () => {
        getNotificationsFromAPI((err, notifications) => {
          if (err) return console.log(err);

          Notifications.new(notifications, err => {
            if (err) return console.log(err);

            console.log('New notifications are fetched and saved.');
          });
        });
      });

      return callback(null, notifications);
    });
  },
  set: (notifications, callback) => {
    fs.writeFile(notificationsPath, JSON.stringify(notifications, null, 2), err => {
      if (err)
        return callback(err);

      return callback(null);
    });
  },
  new: (new_notifications, callback) => {
    getLocalNotifications((err, local_notifications) => {
      if (err) return callback(err);

      const localNotificationIds = new Set(local_notifications.map(n => n._id));
      const newNotifications = new_notifications.filter(new_notification => !localNotificationIds.has(new_notification._id));

      Notifications.set([...local_notifications, ...newNotifications], err => {
        if (err) return callback(err);

        return callback(null);
      });
    });
  },
  markAllAsSeen: callback => {
    getLocalNotifications((err, notifications) => {
      if (err) return callback(err);

      Notifications.set(notifications.forEach(notification => notification.is_seen = true), err => {
        if (err) return callback(err);

        return callback(null);
      });
    });
  }
};

module.exports = Notifications;