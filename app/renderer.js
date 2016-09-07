const electron = require('electron');

const ipc = electron.ipcRenderer;

document.getElementById('start').addEventListener('click', _ => {
    // console.log('start');
    ipc.send('log-r', 'foo');
});

document.getElementById('update').addEventListener('click', _ => {
    ipc.send('update', 'update click');

});

ipc.on('update-ready', function(evt, data) {
    alert('Updates ready, please restart the application');
})

ipc.on('log', function(evt, data) {
    console.log(data);
});