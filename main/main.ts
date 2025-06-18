import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';
import { SlotsService } from './business/slots-service';
import { DoublingColor } from './domain/doubling-color.enum';

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

app.whenReady().then(() => {
    initIpcActions()
    initSubjects()
    createWindow()
});

function initIpcActions() {
    ipcMain.handle("action:spin", async (_) => {
        SlotsService.getInstance().spin();
    });
    ipcMain.handle("action:selectBet", async (_, bet) => {
        SlotsService.getInstance().selectBet(bet)
    })
    ipcMain.handle("action:clickDoubleButton", async (_) => {
        SlotsService.getInstance().enterDoubling()
    })
    ipcMain.handle("action:clickRedDoubleButton", async (_) => {
        SlotsService.getInstance().double(DoublingColor.RED)
    })
    ipcMain.handle("action:clickBlackDoubleButton", async (_) => {
        SlotsService.getInstance().double(DoublingColor.BLACK)
    })
    ipcMain.handle("action:clickExitDoubleButton", async (_) => {
        SlotsService.getInstance().exitDoubling()
    })
}

function initSubjects() {
    const slotsService: SlotsService = SlotsService.getInstance();
    slotsService.spinResultObservable.subscribe(spinResult => {
        mainWindow?.webContents.send("rx:spinResultObservable", spinResult)
    })
    slotsService.amountWonObservable.subscribe(amountWon => {
        mainWindow?.webContents.send("rx:amountWonObservable", amountWon)
    })
    slotsService.amountLostObservable.subscribe(amountLost => {
        mainWindow?.webContents.send("rx:amountLostObservable", amountLost)
    })
    slotsService.spinStateObservable.subscribe(spinState => {
        mainWindow?.webContents.send("rx:spinStateObservable", spinState)
    })
    slotsService.selectedBetObservable.subscribe(selectedBet => {
        mainWindow?.webContents.send("rx:selectedBetObservable", selectedBet)
    })
    slotsService.currentWinObservable.subscribe(currentWin => {
        mainWindow?.webContents.send("rx:currentWinObservable", currentWin);
    })
    slotsService.randomChosenColorObservable.subscribe(randomChosenColor => {
        mainWindow?.webContents.send("rx:randomChosenColorObservable", randomChosenColor)
    })
    slotsService.rustLevelObservable.subscribe(rustLevel => {
        mainWindow?.webContents.send("rx:rustLevelObservable", rustLevel)
    });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
