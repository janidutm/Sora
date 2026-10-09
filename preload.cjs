const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('sora',{
  fullscreen: value=>ipcRenderer.invoke('fullscreen',value),
  exportBackup: value=>ipcRenderer.invoke('exportBackup',value),
  importBackup: ()=>ipcRenderer.invoke('importBackup'),
  restoreBackup: value=>ipcRenderer.invoke('restoreBackup',value),
  schedule: ()=>ipcRenderer.invoke('schedule'),
  onFullscreen: fn=>ipcRenderer.on('fullscreen-state',(_event,value)=>fn(value)),
  detail: id=>ipcRenderer.invoke('detail',id),
  catalogue: q=>ipcRenderer.invoke('catalogue',q),
  sources: q=>ipcRenderer.invoke('sources',q),
  episodes: id=>ipcRenderer.invoke('episodes',id),
  play: req=>ipcRenderer.invoke('play',req),
  external: req=>ipcRenderer.invoke('external',req),
  enqueue: req=>ipcRenderer.invoke('enqueue',req),
  cancel: id=>ipcRenderer.invoke('cancel',id),
  state: ()=>ipcRenderer.invoke('state'),
  save: value=>ipcRenderer.invoke('save',value),
  reveal: ()=>ipcRenderer.invoke('reveal'),
  onQueue: fn=>{ipcRenderer.on('queue',(_event,value)=>fn(value));}
});
