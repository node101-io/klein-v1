const dotenv = require('dotenv');
const path = require('path');

const { app, BrowserWindow } = require('electron');
const windowStateKeeper = require('electron-window-state');

dotenv.config({ path: path.join(__dirname, '../../.env') });

let mainWindow;

const renderPugFile = require('../src/js/functions/renderPugFile');
const ipcSSH = require('./modules/ssh');

const createMainWindow = () => {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1280,
    defaultHeight: 720,
  });

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindowState.manage(mainWindow);

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.show();
    mainWindow.focus();
  });

  if (process.env.DEV_MODE)
    mainWindow.on("ready-to-show", () => {
      mainWindow.webContents.openDevTools();
    });

  renderPugFile('login/index', {
    page: 'login/index',
    includes: {
      external: {
        js: ['page']
      }
    }
  }, (err, path) => {
    if (err)
      return console.error(err);

    mainWindow.loadFile(path);
  });
};

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (!BrowserWindow.getAllWindows().length) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});