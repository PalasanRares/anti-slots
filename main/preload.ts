import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  spin: (bet: number) => ipcRenderer.invoke("action:spin", bet),
  spinResult: (callback: any) => ipcRenderer.on("rx:spinResult", (_, data) => callback(data))
});
