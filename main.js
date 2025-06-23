const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createNoteWindow(noteId = 'note-default') {
  const win = new BrowserWindow({
    width: 160,
    height: 160,
    frame: false, // 关键：无边框窗口
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  win.loadFile('index.html');
  // 页面加载完后传递 noteId
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('init-note', noteId);
  });
}

function setupMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建便签',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            const id = `note-${Date.now()}`;
            createNoteWindow(id);
          }
        },
        {
          role: 'quit',
          label: '退出'
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { type: 'separator' },
        {
          label: '清空便签',
          accelerator: 'CmdOrCtrl+K',
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.send('clear-note');
          }
        },
        {
          label: '删除便签',
          accelerator: 'CmdOrCtrl+D',
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win) win.close();
          }
        }
      ]
    },
    {
      label: '字体大小',
      submenu: [
        {
          label: '12',
          type: 'radio',
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.send('set-font-size', '12');
          }
        },
        {
          label: '14',
          type: 'radio',
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.send('set-font-size', '14');
          }
        },
        {
          label: '16',
          type: 'radio',
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.send('set-font-size', '16');
          }
        },
        {
          label: '18',
          type: 'radio',
          checked: true,
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.send('set-font-size', '18');
          }
        },
        {
          label: '20',
          type: 'radio',
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.send('set-font-size', '20');
          }
        },
        {
          label: '24',
          type: 'radio',
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.send('set-font-size', '24');
          }
        },
        {
          label: '28',
          type: 'radio',
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.send('set-font-size', '28');
          }
        },
        {
          label: '32',
          type: 'radio',
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.send('set-font-size', '32');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createNoteWindow();
  setupMenu();
});