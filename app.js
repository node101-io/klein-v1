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
const Preferences = require('./utils/preferences');
const WebSocketServer = require('./utils/webSocketServer');

const APP_PORT = process.env.APP_PORT || 10101;
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 10180;
const DEEP_LINK_PROTOCOL = process.env.DEEP_LINK_PROTOCOL || 'klein-run';

const expressApp = express();
const localServer = http.createServer(expressApp);

const authRouteController = require('./routes/authRoute');
const indexRouteController = require('./routes/indexRoute');
const sshRouteController = require('./routes/sshRoute');
const notificationRouteController = require('./routes/notificationRoute');
const preferenceRouteController = require('./routes/preferenceRoute');

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
expressApp.use('/ssh', sshRouteController);
expressApp.use('/notification', notificationRouteController);
expressApp.use('/preference', preferenceRouteController);
expressApp.all('*', (req, res) => {
  res.redirect('/');
});

const setupTrayMenu = _ => {
  const image = nativeImage.createFromPath(path.join(__dirname, 'public/img/icons/favicon.ico'));
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
    AppKey.create((err, data) => {
      if (err) return console.log(`AppKey could not be created: ${err}`);

      console.log(`AppKey is ${data.encrypted ? '' : 'not'} encrypted and is created.`);
    });
    WebSocketServer.create(WEBSOCKET_PORT, err => {
      if (err) return console.log(`WebSocketServer could not be started: ${err}`);

      console.log(`WebSocketServer is on port ${WEBSOCKET_PORT} and is running.`);
    });
    Preferences.init((err, preferences) => {
      if (err) return console.log(err);

      console.log('Preferences are initialized.');
    });

    localServer.listen(APP_PORT, _ => {
      console.log(`Server is on port ${APP_PORT} and is running.`);

      setupTrayMenu();

      setupDeepLink();
    }).on('error', err => {
      if (err.code == 'EADDRINUSE')
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
  })
  .on('open-url', (event, url) => {
    dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`);
  })
  .on('second-instance', (event, commandLine, workingDirectory) => {
    dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine.pop()}`);
  });