var link1 = 'http://glearn.gitam.edu/student/welcome.aspx'
var link2 = 'http://glearn.gitam.edu/student/mytimetable.aspx'

var subjectCodes = []

function windowOnload(window){
  if(window.webContents.getURL() == link1){
    getSubjectCodes(window)
  }
  if(window.webContents.getURL() == link2){
    getTimetable(window, (timetable)=>{
      var convertedAr = convertToNames(timetable)
      replaceTimeTable(window, convertedAr)
    })
  }
}

function getSubjectCodes(window){
  let code = `
  document.getElementById("ContentPlaceHolder1_GridView2").innerHTML
  `
  window.webContents.executeJavaScript(code).then((result) => {
    var ar = result.split("<tr>")
    for (const key in ar) {
      try {
        var h4 = ar[key].split('<h4>')[1].split('</h4>')[0]
        var h6 = ar[key].split('<h6>')[1].split('</h6>')[0]
        subjectCodes.push([h4,h6])
      } catch (error) {}
    }
  })
}

function getTimetable(window, callback){
  let code = `
  document.getElementById("ContentPlaceHolder1_grd1").innerHTML
  `
  window.webContents.executeJavaScript(code).then((result) => {
    var ar = result.split("</tr>")
    var timetable = []
    ar.forEach(elem => {
      try {
        var tr = elem.split('<tr>')[1].trim()
        var tdAr = tr.split('</td>')
        var day = []
        tdAr.forEach(element => {
          try {
            day.push(element.split('<td>')[1].trim())
          } catch (error) {}
        });
        if(day.length != 0){
          timetable.push(day)
        }
      } catch (error) {}
    });
    callback(timetable)
  })
}

function convertToNames(t){
  var timetable = t
  subjectCodes.forEach(element => {
    for (const i in timetable) {
      for (const j in timetable[i]) {
        if (timetable[i][j].includes(element[0])){
          timetable[i][j] = element[1]
        }
      }
    }
  });
  return timetable
}

function replaceTimeTable(window, newTable) {
  for (let key in newTable.reverse()) {
    let code = 
  `
  var table = document.getElementById("ContentPlaceHolder1_grd1");
  table.deleteRow(-1);
  var row = table.insertRow(1);
  row.insertCell(0).innerHTML = "${newTable[key][0]}";
  row.insertCell(1).innerHTML = "${newTable[key][1]}";
  row.insertCell(2).innerHTML = "${newTable[key][2]}";
  row.insertCell(3).innerHTML = "${newTable[key][3]}";
  row.insertCell(4).innerHTML = "${newTable[key][4]}";
  row.insertCell(5).innerHTML = "${newTable[key][5]}";
  row.insertCell(6).innerHTML = "${newTable[key][6]}";
  row.insertCell(7).innerHTML = "${newTable[key][7]}";
  row.insertCell(8).innerHTML = "${newTable[key][8]}";
  row.insertCell(9).innerHTML = "${newTable[key][9]}";
  row.insertCell(10).innerHTML = "${newTable[key][10]}";
  row.insertCell(11).innerHTML = "${newTable[key][11]}";
  `
  window.webContents.executeJavaScript(code)
  }
  
}

module.exports= {windowOnload}

