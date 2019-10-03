let electron = require('electron')
let { app, BrowserWindow } = require('electron')
let { fork } = require('child_process')
let findOpenSocket = require('./find-open-socket')
let isDev = require('electron-is-dev')

let clientWin
let serverWin
let serverProcess
let width, height

function createWindow(socketName) {
  clientWin = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + '/src/client/client-preload.js'
    }
  })

  clientWin.loadFile('public/client-index.html')

  clientWin.webContents.openDevTools()

  clientWin.webContents.on('did-finish-load', () => {
    clientWin.webContents.send('set-socket', {
      name: serverSocket
    })
  })
}

function createBackgroundWindow(socketName) {
  const win = new BrowserWindow({
    width,
    height,
    show: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadFile(__dirname + '/src/server/server-dev.html')

  win.webContents.openDevTools()

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('set-socket', { name: socketName })
  })

  serverWin = win
}

function createBackgroundProcess(socketName) {
  serverProcess = fork(__dirname + '/server.js', [
    '--subprocess',
    app.getVersion(),
    socketName
  ])

  serverProcess.on('message', msg => {
    console.log(msg)
  })
}

app.on('ready', async () => {
  width = electron.screen.getPrimaryDisplay().workAreaSize.width
  height = electron.screen.getPrimaryDisplay().workAreaSize.height

  serverSocket = await findOpenSocket()

  createWindow(serverSocket)

  if (isDev) {
    createBackgroundWindow(serverSocket)
  } else {
    createBackgroundProcess(serverSocket)
  }
})

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill()
    serverProcess = null
  }
})
