const autoUpdater = require('update-electron-app');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const express = require('express');
const favicon = require('serve-favicon');
const http = require('http');
const i18n = require('i18n');
const path = require('path');
const session = require('express-session');
const {
  app: electronApp,
  clipboard,
  dialog,
  Menu,
  nativeImage,
  shell,
  Tray
} = require('electron');

dotenv.config();

const AppKey = require('./utils/appKey');
const Notifications = require('./utils/notifications');
const Preferences = require('./utils/preferences');
const SavedServers = require('./utils/savedServers');
const WebSocketServer = require('./utils/webSocketServer');

const APP_PORT = process.env.APP_PORT || 10101;
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 10180;
const DEEP_LINK_PROTOCOL = process.env.DEEP_LINK_PROTOCOL || 'klein-run';

const expressApp = express();
const localServer = http.createServer(expressApp);

const authRouteController = require('./routes/authRoute');
const indexRouteController = require('./routes/indexRoute');
const nodeRouteController = require('./routes/nodeRoute');
const notificationRouteController = require('./routes/notificationRoute');
const preferenceRouteController = require('./routes/preferenceRoute');
const projectRouteController = require('./routes/projectRoute');
const sshRouteController = require('./routes/sshRoute');
const savedServerRouteController = require('./routes/savedServerRoute');

i18n.configure({
  locales: ['en', 'tr'],
  directory: path.join(__dirname, 'translations'),
  queryParameter: 'lang',
  defaultLocale: 'en'
});

expressApp.set('view engine', 'pug');
expressApp.set('views', path.join(__dirname, 'views'));

expressApp.use(express.static(path.join(__dirname, 'public')));
expressApp.use(favicon(path.join(__dirname, 'public', 'img/icons/favicon.ico')));
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(i18n.init);
expressApp.use(WebSocketServer.getPortHandler(WEBSOCKET_PORT));
expressApp.use(session({
  secret: 'node101', // TODO: change this data/ yoksa oluştur varsa al
  resave: false,
  saveUninitialized: true
}));
expressApp.use('/', indexRouteController);
expressApp.use('/auth', authRouteController);
expressApp.use('/node', nodeRouteController);
expressApp.use('/notification', notificationRouteController);
expressApp.use('/preference', preferenceRouteController);
expressApp.use('/project', projectRouteController);
expressApp.use('/ssh', sshRouteController);
expressApp.use('/saved-server', savedServerRouteController);
expressApp.use((req, res) => res.redirect('/'));

const setupTrayMenu = _ => {
  const image = nativeImage.createFromPath(path.join(__dirname, 'build/icon.png'));
  const tray = Tray(image.resize({ width: 16, height: 16 }));
  const menu = Menu.buildFromTemplate([
    {
      label: 'Launch',
      click: _ => shell.openExternal(`http://localhost:${APP_PORT}/auth?app_key=${AppKey.get()}`)
    },
    {
      label: 'About',
      click: _ => dialog.showMessageBox({
        type: 'info',
        message: `node101 | ${electronApp.getVersion()}`,
        icon: image
      })
    },
    {
      label: 'Copy Unique Key',
      click: _ => clipboard.writeText(AppKey.get())
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      click: _ => electronApp.quit()
    }
  ]);

  tray.setContextMenu(menu);
};

const setupDeepLink = _ => {
  if (process.defaultApp) {
    if (process.argv.length >= 2)
      electronApp.setAsDefaultProtocolClient(DEEP_LINK_PROTOCOL, process.execPath, [path.resolve(process.argv[1])]);
  } else {
    electronApp.setAsDefaultProtocolClient(DEEP_LINK_PROTOCOL);
  };
};

if (!electronApp.requestSingleInstanceLock())
  electronApp.quit();

electronApp.dock.hide();

autoUpdater.updateElectronApp();

electronApp
  .on('ready', _ => {
    AppKey.create();

    WebSocketServer.create(WEBSOCKET_PORT, err => {
      if (err) return console.log(err);

      Preferences.init((err, preferences) => {
        if (err) return console.log(err);

        Notifications.init((err, notifications) => {
          if (err) return console.log(err);

          SavedServers.init((err, savedServers) => {
            if (err) return console.log(err);

            localServer.listen(APP_PORT, _ => {
              console.log(`Server is on port ${APP_PORT} and is running.`);

              setupTrayMenu();
              setupDeepLink();
            }).on('error', err => {
              if (err && err.code === 'EADDRINUSE')
                dialog.showMessageBoxSync({
                  type: 'warning',
                  message: `Port ${APP_PORT} is already in use by another application. System restart is recommended.`
                });
              else
                dialog.showMessageBoxSync({
                  type: 'error',
                  message: `Server could not be started: ${err}`
                });

              electronApp.quit();
            });
          });
        });
      });
    });
  })
  .on('open-url', (event, url) => {
    dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`);
  })
  .on('second-instance', (event, commandLine, workingDirectory) => {
    dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine.pop()}`);
  });
