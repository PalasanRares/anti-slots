import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { weightedRandomPrize } from './utils/weighted-random-prize';
import { Spinner } from './domain/spinner';
import { Prize } from './domain/prize';
import { SpinResult } from './domain/spin-result';

let mainWindow: BrowserWindow | null = null;

async function spin(bet: number): Promise<SpinResult> {
    return Spinner.getInstance().generateSpin(bet);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: __dirname + '/preload.js'
    },
    resizable: false,
    // frame: false,
    show: false
  });
  mainWindow.loadFile('src/html/index.html');
  mainWindow.show();
}

app.whenReady().then(() => {
    ipcMain.handle("action:spin", async (_, bet) => {
      return spin(bet)
    });
    createWindow()
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
