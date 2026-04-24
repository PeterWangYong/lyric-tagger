import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveLrc: (content: string, defaultName: string) =>
    ipcRenderer.invoke('dialog:saveLrc', content, defaultName),
})
