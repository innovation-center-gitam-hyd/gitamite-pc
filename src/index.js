const electron = require('electron')
const {BrowserWindow, Menu, MenuItem } = require('electron')
const helper = require('./helper')
const path = require('path')
const checkUpdate = require('./checkUpdate')
require('@electron/remote/main').initialize()


let spAutoLogin = true
let mAutoLogin = true
let menu
let mainWindow
let editWindow
let link1 = 'https://login.gitam.edu/Login.aspx'
let link2 = 'https://learn.gitam.edu/login/index.php'
let releases = 'https://github.com/innovation-center-gitam-hyd/gitamite-pc/releases/latest'

electron.app.on('ready', openMainWindow)
electron.app.on('browser-window-created', (e,window) => {
  if(window.getTitle() != "Edit Credentials"){
    window.setSize( 1200, 750)
  }
  window.center()
  window.setIcon(path.join(__dirname, '../icon.png'))
  window.setMenu(null)
})

function  openMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Gitamite PC"
  })

  mainWindow.loadFile(path.join(__dirname, 'cards.html'))

  createMenu()

  checkForUpdate()

  mainWindow.webContents.on("did-finish-load", () => {

    mainWindow.webContents.findInPage('Invalid login')
    
    if(spAutoLogin){
      autologinStudentPortal()
    }
    if(mAutoLogin){
      autologinMoodle()
    }
  })

  mainWindow.webContents.on('found-in-page', (event, result) => {
    if(result.matches>0){
      mainWindow.webContents.stopFindInPage('clearSelection')
      openEditWindow()
      console.log('Invalid Credentials')
      mAutoLogin = false
      spAutoLogin = false
    }
  }) 
  
  mainWindow.on('closed', () => {
    electron.app.quit()
  })
}

function openCard () {
  mainWindow.loadFile(path.join(__dirname, 'cards.html'))
}

function openEditWindow() {
  editWindow = new BrowserWindow({ 
    title : "Edit Credentials",
    width: 500, height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false 
    }
  })
  require("@electron/remote/main").enable(editWindow.webContents)
  editWindow.loadFile(path.join(__dirname, 'editWindow.html'))
  editWindow.on('closed', () => {
    editWindow = null
  })
}

electron.ipcMain.on('cred', (e,cred) => {
  const userDataPath = helper.getCredPath(electron.app)
  helper.writeToFile(userDataPath, cred)
  editWindow.close()
})

function autologinStudentPortal() {
  if(mainWindow.webContents.getURL() != link1){
    return 
  }
  try {
    const userDataPath = helper.getCredPath(electron.app)
    const data = helper.readFromFile(userDataPath)
    const username = data['G-username']
    const password = data['G-password']
    let code = `
    document.getElementById("txtusername").value = '${username}'
    document.getElementById("password").value = '${password}'
    document.getElementById("Submit").click()
    `
    mainWindow.webContents.executeJavaScript(code)
  } catch (error) {
    console.log(error)
    openEditWindow()
  }
}

function autologinMoodle() {
  if(mainWindow.webContents.getURL() != link2){
    return 
  }
  try {
    const userDataPath = helper.getCredPath(electron.app)
    const data = helper.readFromFile(userDataPath)
    const username = data['M-username']
    const password = data['M-password']
    let code = `
    document.getElementById("username").value = '${username}'
    document.getElementById("password").value = '${password}'
    document.getElementById("loginbtn").click()
    `
    mainWindow.webContents.executeJavaScript(code)
  } catch (error) {
    console.log(error)
    openEditWindow()
  }
}

function checkForUpdate() {
  checkUpdate.isNewUpdateFound().then(bool =>{
    var v = new MenuItem({
      label: 'Update',
      click() { electron.shell.openExternal(releases) }
    })
    
    if(bool){
      menu.append(v)
      Menu.setApplicationMenu(menu)
    }
  })
}

function createMenu() {
  menu = Menu.buildFromTemplate([
    {
      label: 'Home',
      click() { openCard() }
    },
    {
      label:'Edit Credentials',
      click() { openEditWindow() }
    },
    {
      label: 'Reload',
      role: 'reload'
    },
    {
      label: 'Fill',
      click() { 
        autologinStudentPortal()
        autologinMoodle() 
      }
    }
  ])
  Menu.setApplicationMenu(menu) 
}



// windows shortcut crap
if (require('electron-squirrel-startup')) {
  electron.app.quit()
}

// macOS crap 
electron.app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { electron.app.quit() }
})
electron.app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) { createWindow() }
})
