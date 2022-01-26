// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
var http = require("http")

http.createServer(function (req, res) {
  console.log('http server?')

  printWindow({title: 'Invoice Info from server'})
  console.log('print success.');

  res.writeHead(200, 'Ok', { 'Content-Type': 'text/html' })
  res.end('print success.')
}).listen(8889)

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function(){
    app.quit()
  })

  /*
  const contents = mainWindow.webContents
  const printers = contents.getPrinters()
  console.log('printer=>', printers)
  */
}

function printWindow(data) {
  const win = new BrowserWindow({
    show: false
  })
  win.loadFile('print.html')

  win.on('close', function() {
    console.log('close sub window')
  })

  win.webContents.once('dom-ready', function() {
    console.log('dom ready, start printing...', data.title);
    
    const options = {
      silent: true,
      deviceName: 'HP LaserJet MFP M28-M31 PCLm-S',
    }
    win.webContents.print(options, (success, errorType) => {
      if (!success) console.log('error =>', errorType)
    })
    
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('print', function(e, data) {
  console.log('data=>', data)
  printWindow(data);
});







