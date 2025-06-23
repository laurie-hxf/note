const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onSetFontSize: (callback) => ipcRenderer.on('set-font-size', callback),
  onInitNote: (callback) => ipcRenderer.on('init-note', callback),
  onClearNote: (callback) => ipcRenderer.on('clear-note', callback),
});