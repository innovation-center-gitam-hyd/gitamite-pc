const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const helper = require('./helper')
const path = require('path')

let spAutoLogin = true
let mAutoLogin = true
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

  mainWindow.loadFile(path.join(__dirname, 'cards.html'))

  createMenu()

  mainWindow.webContents.on("did-finish-load", () => {
    var link1 = 'https://login.gitam.edu/Login.aspx'
    var link2 = 'https://learn.gitam.edu/login/index.php'
    mainWindow.webContents.findInPage('Invalid login')
    
    if(mainWindow.webContents.getURL() == link1 && spAutoLogin){
      autologinStudentPortal()
      spAutoLogin = false
    }
    if(mainWindow.webContents.getURL() == link2 && mAutoLogin){
      autologinMoodle()
      mAutoLogin = false
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

function openEditWindow(){
  editWindow = new BrowserWindow({ 
    autoHideMenuBar: true,
    width: 500, height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      }
  })
  editWindow.loadFile(path.join(__dirname, 'editWindow.html'))
  editWindow.on('closed', () => {
    editWindow = null
  })
}

ipcMain.on('cred', (e,cred) => {
  helper.writeToFile('cred.txt', cred)
})

function autologinStudentPortal(){
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

function autologinMoodle(){
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


function createMenu() {
  var menu = Menu.buildFromTemplate([
    {
      label:'Edit Credentials',
      click() { openEditWindow() }
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





