const {ipcRenderer} = require('electron')
const helper = require('./helper')

try {
    const data = helper.readFromFile('cred.txt')
    const Gusername = data['G-username']
    const Gpassword = data['G-password']
    document.querySelector('#glearn_username').value = Gusername
    document.querySelector('#glearn_password').value = Gpassword
} catch (error) {}

try {
    const data = helper.readFromFile('cred.txt')
    const Musername = data['M-username']
    const Mpassword = data['M-password']
    document.querySelector('#moodle_username').value = Musername
    document.querySelector('#moodle_password').value = Mpassword
} catch (error) {}


document.querySelector('form').addEventListener('submit', submitForm);
function submitForm(e){
    e.preventDefault();
    const gUsername = document.querySelector('#glearn_username').value;
    const gPassword = document.querySelector('#glearn_password').value;
    const mUsername = document.querySelector('#moodle_username').value;
    const mPassword = document.querySelector('#moodle_password').value;
    const data = {
        'G-username' : gUsername,
        'G-password' : gPassword,
        'M-username' : mUsername,
        'M-password' : mPassword
    }
    ipcRenderer.send('cred', data);
}