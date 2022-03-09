/**
 * Entry of electron app
 */
import { app, BrowserWindow, ipcMain, screen as electronScreen } from 'electron';
import path from 'path';
import { isDevelopment, logger, resolveHtmlPath } from './util';

// Only allow one app at a time.
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit();
}

// Configure debug settings
if (isDevelopment) {
  const debug = require('electron-debug');
  debug({
    devToolsMode: 'undocked'
  });
}

// Install react developer extension
const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];
  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

// Example of how to receive messages from renderer process and reply.
ipcMain.on('ping', (event) => {
  logger.debug('Received ping from renderer process.');
  event.sender.send('pong', 'pong');
  // Alternatively:
  // mainWindow.webContents.send('pong', 'pong');
});

// Initialize main window
const createMainWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  let mainWindow = new BrowserWindow({
    width: electronScreen.getPrimaryDisplay().workArea.width,
    height: electronScreen.getPrimaryDisplay().workArea.height,
    show: false,
    backgroundColor: 'white',
    icon: 'public/logo512.png',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.resolve(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    //mainWindow = null;
  });
};

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (!BrowserWindow.getAllWindows().length) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
