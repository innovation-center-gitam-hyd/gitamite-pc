var CryptoJS = require("crypto-js")
const fs = require('fs')
const path = require('path')

var key = 'your secret key 123'

function getCredPath(app){
    const userDataPath = app.getPath('userData')
    const fullPath = path.join(userDataPath,'UserData/cred.txt')
    return fullPath
}

function encrypt (message){
    var ciphertext = CryptoJS.AES.encrypt(message, key).toString()
    return ciphertext
}
function decrypt (cipher){
    var bytes  = CryptoJS.AES.decrypt(cipher, key)
    var originalText = bytes.toString(CryptoJS.enc.Utf8)
    return originalText
}

function writeToFile(path, data){
    var data_string = JSON.stringify(data)
    var data_encrypted = encrypt(data_string)
    fs.writeFileSync(path, data_encrypted, 'utf-8')
}

function readFromFile(path){
    var data_encrypted = fs.readFileSync(path, {encoding:'utf8'})+''
    var data_decrypted = decrypt(data_encrypted)
    var data = JSON.parse(data_decrypted)
    return data
}

module.exports = { encrypt, decrypt, writeToFile, readFromFile, getCredPath }