const autoUpdater = require('update-electron-app');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const express = require('express');
const favicon = require('serve-favicon');
const http = require('http');
const path = require('path');
// const session = require('express-session');

dotenv.config({ path: path.join(__dirname, '.env') });

const { app, Tray, Menu, nativeImage, shell } = require('electron');

app.whenReady().then(() => {
  app.dock.hide();

  const image = nativeImage.createFromPath(
    path.join(__dirname, 'public/img/icons/favicon.ico')
  );
  const tray = new Tray(image.resize({ width: 16, height: 16 }));

  tray.setToolTip('Klein');
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Launch',
      click: () => {
        shell.openExternal('http://localhost:3000')
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]));

  autoUpdater.updateElectronApp()
});

const expressApp = express();
const server = http.createServer(expressApp);

const PORT = process.env.PORT || 3000;
const MAX_QUERY_LIMIT = 1e3;
const QUERY_LIMIT = 20;

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
expressApp.use(bodyParser.urlencoded({
  extended: true
}));

// const sessionOptions = session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
// });

// expressApp.use(sessionOptions);

expressApp.use((req, res, next) => {
  if (!req.query || typeof req.query != 'object')
    req.query = {};
  if (!req.body || typeof req.body != 'object')
    req.body = {};

  if (!req.query.limit || isNaN(parseInt(req.query.limit)) || parseInt(req.query.limit) < 1 || parseInt(req.query.limit) > MAX_QUERY_LIMIT) {
    res.locals.QUERY_LIMIT = QUERY_LIMIT;
    req.query.limit = QUERY_LIMIT;
  } else {
    res.locals.QUERY_LIMIT = parseInt(req.query.limit);
    req.query.limit = parseInt(req.query.limit);
  };

  next();
});

expressApp.get('/', (req, res) => {
  return res.redirect('/login');
});
expressApp.use('/login', loginRouteController);
expressApp.use('/home', homeRouteController);
expressApp.use('/node', nodeRouteController);
expressApp.use('/ssh', sshRouteController);
expressApp.use('/notification', notificationRouteController);

server.listen(PORT, () => {
  console.log(`Server is on port ${PORT} and is running.`);
});


// TODO: cluster