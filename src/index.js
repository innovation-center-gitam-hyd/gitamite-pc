const { app, shell, BrowserWindow, Menu, MenuItem, ipcMain } = require('electron')
const helper = require('./helper')
const path = require('path')
const checkUpdate = require('./checkUpdate')

let spAutoLogin = true
let mAutoLogin = true
let menu
let mainWindow
let editWindow
let link1 = 'https://login.gitam.edu/Login.aspx'
let link2 = 'https://learn.gitam.edu/login/index.php'
let releases = 'https://github.com/innovation-center-gitam-hyd/gitamite-pc/releases/latest'

app.on('ready', openMainWindow)
app.on('browser-window-created', (e,window) => {
  if(window.getTitle() != "Edit Credentials"){
    window.setSize( 1200, 750)
  }
  window.center()
  window.setIcon(path.join(__dirname, '../icon.png'))
  window.setMenu(null)
  window.webPreferences = {
    nodeIntegration: true,
    contextIsolation: false,
  }
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
    app.quit()
  })
}

function openCard () {
  mainWindow.loadFile(path.join(__dirname, 'cards.html'))
}

function openEditWindow() {
  editWindow = new BrowserWindow({ 
    title : "Edit Credentials",
    width: 500, height: 500
  })
  editWindow.loadFile(path.join(__dirname, 'editWindow.html'))
  editWindow.on('closed', () => {
    editWindow = null
  })
}

ipcMain.on('cred', (e,cred) => {
  helper.writeToFile('cred.txt', cred)
})

function autologinStudentPortal() {
  if(mainWindow.webContents.getURL() != link1){
    return 
  }
  try {
    const data = helper.readFromFile('cred.txt')
    const username = data['G-username']
    const password = data['G-password']
    let code = `
    document.getElementById("txtusername").value = '${username}'
    document.getElementById("password").value = '${password}'
    document.getElementById("Submit").click()
    `
    mainWindow.webContents.executeJavaScript(code)
  } catch (error) {
    openEditWindow()
  }
}

function autologinMoodle() {
  if(mainWindow.webContents.getURL() != link2){
    return 
  }
  try {
    const data = helper.readFromFile('cred.txt')
    const username = data['M-username']
    const password = data['M-password']
    let code = `
    document.getElementById("username").value = '${username}'
    document.getElementById("password").value = '${password}'
    document.getElementById("loginbtn").click()
    `
    mainWindow.webContents.executeJavaScript(code)
  } catch (error) {
    openEditWindow()
  }
}

function checkForUpdate() {
  checkUpdate.isNewUpdateFound().then(bool =>{
    var v = new MenuItem({
      label: 'Update',
      click() { shell.openExternal(releases) }
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
  app.quit()
}

// macOS crap 
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit() }
})
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) { createWindow() }
})
