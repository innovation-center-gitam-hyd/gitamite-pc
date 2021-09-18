const {ipcRenderer} = require('electron')

document.querySelector('form').addEventListener('submit', submitForm);
function submitForm(e){
    e.preventDefault();
    const gUsername = document.querySelector('#glearn_username').value;
    const gPassword = document.querySelector('#glearn_password').value;
    //const mUsername = document.querySelector('#moodle_username').value;
    //const mPassword = document.querySelector('#moodle_password').value;
    const data = {
        'G-username' : gUsername,
        'G-password' : gPassword,
        //'M-username' : mUsername,
        //'M-password' : mPassword
    }
    ipcRenderer.send('cred', data);
}