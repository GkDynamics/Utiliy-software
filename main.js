const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');

  // Handle directory selection
  ipcMain.handle('choose-directory', async () => {
    const result = await dialog.showOpenDialog(win, {
      properties: ['openDirectory'],
    });
    if (!result.canceled) {
      return result.filePaths[0];
    }
    return null;
  });

  // Handle file/folder creation
  ipcMain.handle('create-entries', async (event, dir, entries) => {
    entries.forEach(entry => {
      const fullPath = path.join(dir, entry.trim());

      if (entry.endsWith('/')) {
        // Create folder
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
        }
      } else {
        // Create file
        const folder = path.dirname(fullPath);
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder, { recursive: true });
        }
        fs.writeFileSync(fullPath, '');
      }
    });

    return true;
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
