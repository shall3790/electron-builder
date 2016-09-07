const electron = require('electron')

// auto Updater
const autoUpdater = electron.autoUpdater;
// const appVersion = require('./package.json').version;
const os = require('os').platform();
const ipc = electron.ipcMain;

var updateFeed = 'http://lpchl00437/SquirrelTest/builder/';

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// set update url
autoUpdater.setFeedURL(updateFeed); // + '?v=' + appVersion);
// autoUpdater.checkForUpdates();

if (require('electron-squirrel-startup')) return;

// this should be placed at top of main.js to handle setup events quickly
// if (handleSquirrelEvent()) {
//   // squirrel event handled and app will exit in 1000ms, so don't do anything else
//   return;
// }




// autoUpdater event handlers
autoUpdater.on('update-downloaded', function(event, releaseNotes, releaseName, releaseDate, updateUrl) {
    //
    console.log('update-downloaded event');
    mainWindow.webContents.send('log', 'update downloaded event');
    mainWindow.webContents.send('update-ready');
    // autoUpdater.quitAndInstall();
});

autoUpdater.on('update-not-available', function() {
    console.log('no update available event');
    mainWindow.webContents.send('log', 'no update available event');
});

autoUpdater.on('error', function(error) {
    console.log('error event: ' + error);
    mainWindow.webContents.send('log', 'error event: ' + error);
});

autoUpdater.on('checking-for-update', function() {
    console.log('checking for update event');
    mainWindow.webContents.send('log', 'checking for update event');
});

autoUpdater.on('update-available', function() {
    console.log('update available event');
    mainWindow.webContents.send('log', 'update available event');
});

function createWindow () {
   
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.send('log', 'createWindow function');
  mainWindow.webContents.send('log', 'dev tools createWindow function');

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    console.log('app closed');
    mainWindow = null;
    app.quit();
  })
}

ipc.on('update', function(evt, data) {
    console.log('update event ');
    mainWindow.webContents.send('log', data);
    autoUpdater.checkForUpdates();
});

ipc.on('log-r', function(evt, data) {
    console.log('caught log-r: ' + data);
    mainWindow.webContents.send('log', data);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('uncaughtException', function (error) {
    console.log('uncaught exception: ' + error );
    app.quit();
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
})

