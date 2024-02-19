const autoUpdater = require('update-electron-app');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const electron = require('electron');
const express = require('express');
const favicon = require('serve-favicon');
const http = require('http');
const path = require('path');

const webSocketInstance = require('./websocket/Instance');

dotenv.config({ path: path.join(__dirname, '.env') });

electron.app.whenReady().then(() => {
  electron.app.dock.hide();

  const image = electron.nativeImage.createFromPath(
    path.join(__dirname, 'public/img/icons/favicon.ico')
  );

  const tray = new electron.Tray(image.resize({ width: 16, height: 16 }));

  tray.setToolTip('Klein');
  tray.setContextMenu(electron.Menu.buildFromTemplate([
    {
      label: 'Launch',
      click: () => {
        electron.shell.openExternal('http://localhost:3000')
      }
    },
    {
      label: 'Quit',
      click: () => {
        electron.app.quit();
      }
    }
  ]));

  autoUpdater.updateElectronApp()
});

const expressApp = express();
const server = http.createServer(expressApp);

const PORT = process.env.PORT || 10101;
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 10180;

const loginRouteController = require('./routes/loginRoute');
const homeRouteController = require('./routes/homeRoute');
const nodeRouteController = require('./routes/nodeRoute');
const sshRouteController = require('./routes/sshRoute');
const notificationRouteController = require('./routes/notificationRoute');

expressApp.set('views', path.join(__dirname, 'views'));
expressApp.set('view engine', 'pug');

expressApp.use(express.static(path.join(__dirname, 'public')));
expressApp.use(favicon(path.join(__dirname, 'public', 'img/icons/favicon.ico')));
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));

webSocketInstance.create(WEBSOCKET_PORT);

expressApp.use((req, res, next) => {
  if (!req.query || typeof req.query != 'object')
    req.query = {};
  if (!req.body || typeof req.body != 'object')
    req.body = {};

  res.locals.WEBSOCKET_PORT = WEBSOCKET_PORT;

  next();
});

expressApp.get('/', (req, res) => {
  return res.redirect('/login'); // TODO
});
expressApp.use('/login', loginRouteController);
expressApp.use('/home', homeRouteController);
expressApp.use('/node', nodeRouteController);
expressApp.use('/ssh', sshRouteController);
expressApp.use('/notification', notificationRouteController);

server.listen(PORT, () => {
  console.log(`Server is on port ${PORT} and is running.`);
});