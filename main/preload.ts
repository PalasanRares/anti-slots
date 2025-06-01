import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  spin: (bet: number) => ipcRenderer.invoke("action:spin", bet),
  test: (callback: any) => ipcRenderer.on("action:test", (_, data) => callback(data))
});
