import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { Spinner } from './business/spinner';
import { SpinResult } from './domain/spin-result';
import { interval, Observable, Subject } from 'rxjs';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

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
    initIpcActions()
    initSubjects()
    createWindow()
});

function initIpcActions() {
    ipcMain.handle("action:spin", async (_, bet) => {
        Spinner.getInstance().spin(bet)
    });
}

function initSubjects() {
    Spinner.getInstance().spinResultObservable.subscribe(spinResult => {
        mainWindow?.webContents.send("rx:spinResult", spinResult)
    })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
