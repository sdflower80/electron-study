// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const fnGreeting = () => {
    console.log("Hello World!");
};

const btnGreeting = document.getElementById('btnGreeting');
console.log("greeting=>", btnGreeting);

btnGreeting.addEventListener('click', function(e){
    fnGreeting();

    const {ipcRenderer} = require('electron');

    ipcRenderer.send('load:web', 'loading..');
});