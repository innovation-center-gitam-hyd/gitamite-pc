const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const helper = require('./helper')
const path = require('path')
const fs = require('fs')

let mainWindow
let editWindow

app.on('ready', openMainWindow)

function  openMainWindow(){
  mainWindow = new BrowserWindow({
    width: 800, height: 600, minHeight:400, minWidth:400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
     }
  })

  mainWindow.loadURL('https://login.gitam.edu/Login.aspx')

  createMenu()

  mainWindow.webContents.on("did-finish-load", ()=>{
    autologin()
  })

  mainWindow.on('closed', ()=>{
    app.quit()
  })
}

function openEditWindow(){
   editWindow = new BrowserWindow({ 
     width: 400, height: 300,
     webPreferences: {
       nodeIntegration: true,
       contextIsolation: false,
      }
    })
   editWindow.loadFile(path.join(__dirname, 'editWindow.html'))
   editWindow.on('closed', ()=>{
    editWindow = null
  })
}

ipcMain.on('cred', (e,cred)=>{
  helper.writeToFile('cred.txt', cred)
})

function autologin(){
  try {
    var data = helper.readFromFile('cred.txt')
    var username = data['G-username']
    var password = data['G-password']
    let code = `
    document.getElementById("txtusername").value = '${username}'
    document.getElementById("password").value = '${password}'
    `
    mainWindow.webContents.executeJavaScript(code)
  } catch (error) {
    openEditWindow()
  }
}

function createMenu() {
  var menu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        { label:'Edit Credentials',
          click() { openEditWindow() }},
        { label:'Exit',                 
          click() { app.quit() }}
      ]
    },
    {
      label: 'Reload',
      role: 'reload'
    }
  ])
  Menu.setApplicationMenu(menu) 
}



// windows shortcut crap
if (require('electron-squirrel-startup')) {
  app.quit()
}

// macOS crap 
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit() }
})
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) { createWindow() }
})





