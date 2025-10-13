import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
    spin: () => ipcRenderer.invoke("action:spin"),
    selectBet: (bet: number) => ipcRenderer.invoke("action:selectBet", bet),
    clickDoubleButton: () => ipcRenderer.invoke("action:clickDoubleButton"),
    clickRedDoubleButton: () =>
        ipcRenderer.invoke("action:clickRedDoubleButton"),
    clickBlackDoubleButton: () =>
        ipcRenderer.invoke("action:clickBlackDoubleButton"),
    clickExitDoubleButton: () =>
        ipcRenderer.invoke("action:clickExitDoubleButton"),

    spinResultObservable: (callback: any) =>
        ipcRenderer.on("rx:spinResultObservable", (_, data) => callback(data)),
    amountWonObservable: (callback: any) =>
        ipcRenderer.on("rx:amountWonObservable", (_, data) => callback(data)),
    amountLostObservable: (callback: any) =>
        ipcRenderer.on("rx:amountLostObservable", (_, data) => callback(data)),
    spinStateObservable: (callback: any) =>
        ipcRenderer.on("rx:spinStateObservable", (_, data) => callback(data)),
    selectedBetObservable: (callback: any) =>
        ipcRenderer.on("rx:selectedBetObservable", (_, data) => callback(data)),
    currentWinObservable: (callback: any) =>
        ipcRenderer.on("rx:currentWinObservable", (_, data) => callback(data)),
    randomChosenColorObservable: (callback: any) =>
        ipcRenderer.on("rx:randomChosenColorObservable", (_, data) =>
            callback(data)
        ),
    rustLevelObservable: (callback: any) =>
        ipcRenderer.on("rx:rustLevelObservable", (_, data) => callback(data))
});
