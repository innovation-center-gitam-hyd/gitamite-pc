var link1 = 'http://glearn.gitam.edu/student/welcome.aspx'
var link2 = 'http://glearn.gitam.edu/student/mytimetable.aspx'


function getSubjectCodes(window){

  if(window.webContents.getURL() == link1){
    window.webContents.openDevTools()
    let code = `
    document.getElementById("ContentPlaceHolder1_GridView2_UpdatePanel1_0").innerHTML
    `
    window.webContents.executeJavaScript(code).then((result) =>{
      console.log(result)
    })
  }
}

module.exports= { getSubjectCodes }

