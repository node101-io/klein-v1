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
const WebSocketInstance = require('./websocket/Instance');

const APP_PORT = process.env.APP_PORT || 10101;
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 10180;
const DEEP_LINK_PROTOCOL = process.env.DEEP_LINK_PROTOCOL || 'klein-run';
const TRAY_HOVER_TEXT = process.env.TRAY_HOVER_TEXT || 'Klein';

const app = express();
const localServer = http.createServer(app);

const authRouteController = require('./routes/authRoute');
const indexRouteController = require('./routes/indexRoute');
const sshRouteController = require('./routes/sshRoute');
const notificationRouteController = require('./routes/notificationRoute');

Preferences.init();
WebSocketInstance.create(WEBSOCKET_PORT);

i18n.configure({
  locales: ['en', 'tr'],
  directory: path.join(__dirname, 'translations'),
  queryParameter: 'lang',
  defaultLocale: 'en'
});

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'img/icons/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(i18n.init);
app.use((req, res, next) => {
  if (!req.query || typeof req.query != 'object')
    req.query = {};
  if (!req.body || typeof req.body != 'object')
    req.body = {};

  res.locals.WEBSOCKET_PORT = WEBSOCKET_PORT;

  return next();
});
app.use(session({
  secret: 'deneme', // TODO: change this
  resave: false,
  saveUninitialized: true
}));

app.use('/', indexRouteController);
app.use('/auth', authRouteController);
app.use('/ssh', sshRouteController);
app.use('/notification', notificationRouteController);
app.use((req, res, next) => {
  if (!req.route)
    return res.redirect('/');

  return next();
});

localServer.listen(APP_PORT, () => {
  console.log(`Server is on port ${APP_PORT} and is running.`);
}).on('error', (err) => {
  if (err.code == 'EADDRINUSE')
    dialog.showErrorBox('Port In Use', `Port ${APP_PORT} is already in use.`);

  console.log(`Port ${APP_PORT} is already in use.`); // TODO: what to do?
});

if (!electronApp.requestSingleInstanceLock())
  electronApp.quit();

electronApp.dock.hide();

electronApp
  .on('ready', () => {
    AppKey.create();

    const image = nativeImage.createFromPath(path.join(__dirname, 'public/img/icons/favicon.ico'));
    const tray = Tray(image.resize({ width: 16, height: 16 }));
    const menu = Menu.buildFromTemplate([
      {
        label: 'Launch',
        click: () => shell.openExternal(`http://localhost:${APP_PORT}`)
      },
      {
        label: 'About',
        click: () => dialog.showMessageBoxSync({
          type: 'info',
          message: `node101 | ${electronApp.getVersion()}`,
          icon: image
        })
      },
      {
        label: 'Copy Unique Key',
        click: () => clipboard.writeText(AppKey.get())
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        click: () => electronApp.quit()
      }
    ]);

    tray.setContextMenu(menu);
    tray.setToolTip(TRAY_HOVER_TEXT);

    autoUpdater.updateElectronApp();
  })
  .on('open-url', (event, url) => {
    dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`);
  })
  .on('second-instance', (event, commandLine, workingDirectory) => {
    dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine.pop()}`);
  });

if (process.defaultApp) {
  if (process.argv.length >= 2)
    electronApp.setAsDefaultProtocolClient(DEEP_LINK_PROTOCOL, process.execPath, [path.resolve(process.argv[1])]);
} else {
  electronApp.setAsDefaultProtocolClient(DEEP_LINK_PROTOCOL);
};