const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const chokidar = require('chokidar');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let win;
app.on('ready', () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true, contextIsolation: false, enableRemoteModule: true },
  });

  // Open Development Tools
  win.openDevTools();

  win.loadFile('src/index.html');
});

if (process.platform === 'win32') {
  app.setAppUserModelId('CD inventory system');
}

app.on('window-all-closed', () => {
  app.quit();
});

// Reload application on changes in src folder
const watcher = chokidar.watch(path.join(__dirname, 'src'), { ignored: /^.*\.(json|txt)$/ });
watcher.on('change', () => {
  if (win) win.webContents.reloadIgnoringCache();
});

// To prevent crash on exit in MacOS
app.on('will-quit', () => {
  watcher.close();
});

app.on('ready', () => {
  /*dialog.showMessageBox({
    type: 'info',
    title: 'Information',
    message: 'Hello World',
    buttons: ['OK', 'Cancel'],
  });*/
  //win.webContents.executeJavascript(`win.dialog = ${JSON.stringify(dialog)}`);
});
