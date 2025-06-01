import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { weightedRandomPrize } from './utils/weighted-random-prize';
import { Spinner } from './domain/spinner';
import { Prize } from './domain/prize';
import { SpinResult } from './domain/spin-result';
import { interval, Observable, Subject } from 'rxjs';
import path from 'path';

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
    frame: false,
    show: false
  });
  mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));
  mainWindow.show();
}

const testObservable = interval(2000) 

app.whenReady().then(() => {
    ipcMain.handle("action:spin", async (_, bet) => {
      return spin(bet)
    });
    testObservable.subscribe(data => {
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send("action:test", data)
      }
    })
    createWindow()
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
