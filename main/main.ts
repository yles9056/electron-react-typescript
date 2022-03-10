/**
 * Entry of electron app
 */
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import settings from 'electron-settings';
import windowStateKeeper from 'electron-window-state';
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

/**
 * Initialize setting file
 */
const initSettingsFile = () => {
  // Configure setting file location and format
  settings.configure({
    dir: isDevelopment
      ? path.resolve(__dirname, '..', 'config')
      : path.resolve(app.getPath('userData'), 'config'),
    fileName: `${app.getName()}_settings.json`,
    numSpaces: 2,
    prettify: true
  });

  // Test if the setting file can be loaded properly.
  // If fail, reset the setting file.
  try {
    settings.getSync();
  } catch (e) {
    logger.error(`Error when loading settings: ${e}`);
    settings.setSync({});
  }
};

initSettingsFile();

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

// Initialize main window
const createMainWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  // Store and restore window sizes and positions
  let mainWindowState = windowStateKeeper({
    defaultWidth: screen.getPrimaryDisplay().workArea.width,
    defaultHeight: screen.getPrimaryDisplay().workArea.height
  });

  let mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
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

// Example of how to receive messages from renderer process and reply.
ipcMain.on('ping', (event) => {
  logger.debug('Received ping from renderer process.');
  event.sender.send('pong', 'pong');
  // Alternatively:
  // mainWindow.webContents.send('pong', 'pong');
});

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
