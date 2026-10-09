const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('sora',{
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
