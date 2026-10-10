const STATUSES=['planned','watching','completed','on-hold','dropped'];
function validateLibrary(value){
  if(!value||!Array.isArray(value.watchlist)||!Array.isArray(value.history))throw Error('This file is not a Sora library.');
  if(JSON.stringify(value).length>5000000)throw Error('Library exceeds the 5 MB limit.');
  if(value.watchlist.length>300||value.history.length>100)throw Error('Library exceeds 300 saved titles or 100 history entries.');
  const media=m=>{if(!m||!Number.isInteger(m.id)||m.id<1||!m.title||![m.title.english,m.title.romaji].some(t=>typeof t==='string'&&t.length>0&&t.length<1000))throw Error('A library title is invalid.');return Object.fromEntries(Object.entries(m).filter(([key])=>['id','title','coverImage','bannerImage','description','genres','episodes','averageScore','seasonYear','format','status'].includes(key)));};
  const watchlist=[...new Map(value.watchlist.map(m=>[media(m).id,media(m)])).values()];
  const history=value.history.map(h=>{media(h.media);if(!/^\d+(\.\d+)?$/.test(String(h.episode))||!Number.isFinite(h.position)||h.position<0||!['sub','dub'].includes(h.mode)||typeof h.provider!=='string'||!/^[\w-]{1,180}$/.test(h.provider))throw Error('A playback history entry is invalid.');return {...h,media:media(h.media),at:Number.isFinite(h.at)?h.at:0};});
  const statuses=Object.fromEntries(Object.entries(value.statuses||{}).filter(([id,status])=>/^\d+$/.test(id)&&STATUSES.includes(status)));
  const raw=value.preferences||{}, preferences={player:{}};
  const username=require('./profile.js').username(raw.username);if(username)preferences.username=username;
  if(raw.profilePicture==='')preferences.profilePicture='';else{const picture=require('./profile.js').picture(raw.profilePicture);if(picture)preferences.profilePicture=picture;}
  const options={'stream-quality':['best','auto','worst','2160','1440','1080','720','480','360','240'],'speed':['0.5','0.75','1','1.25','1.5','1.75','2'],'caption-size':['22','28','36','44'],'caption-color':['white','#ffe27a','#8ac9b2'],'caption-bg':['transparent','#000a','#000'],'caption-position':['7%','17%','75%']};
  for(const [key,choices] of Object.entries(options)){const v=String(raw.player?.[key]??'');if(choices.includes(v))preferences.player[key]=v;}
  for(const [key,min,max] of [['volume',0,1],['caption-offset',-60,60],['skip-seconds',5,180]]){const v=Number(raw.player?.[key]);if(Number.isFinite(v)&&v>=min&&v<=max)preferences.player[key]=String(v);}
  if(typeof raw.player?.['auto-next']==='boolean')preferences.player['auto-next']=raw.player['auto-next'];
  if(['sub','dub'].includes(raw.mode))preferences.mode=raw.mode;
  if(['best','worst','1080','720','480','360'].includes(raw.quality))preferences.quality=raw.quality;
  if(typeof raw.downloadDirectory==='string'&&raw.downloadDirectory.length<4096&&require('node:path').isAbsolute(raw.downloadDirectory))preferences.downloadDirectory=raw.downloadDirectory;
  const counters=Object.fromEntries(Object.entries(value.statistics?.watchSecondsByDevice||{}).filter(([k,v])=>/^[\w-]{1,100}$/.test(k)&&Number.isFinite(v)&&v>=0&&v<1e10).slice(0,1000));
  const times=key=>Object.fromEntries(Object.entries(value[key]||{}).filter(([id,t])=>/^\d+$/.test(id)&&Number.isFinite(t)&&t>=0));
  return {watchlist,history,statuses,preferences,statistics:{watchSecondsByDevice:counters},watchlistAdded:times('watchlistAdded'),watchlistRemoved:times('watchlistRemoved')};
}
function createBackup(library){return {application:'Sora',version:1,developer:'Belu',exportedAt:new Date().toISOString(),library:validateLibrary(library)};}
function parseBackup(value){if(value?.application!=='Sora'||value.version!==1)throw Error('Unsupported backup. Choose a Sora version 1 JSON backup.');return validateLibrary(value.library);}
function restoreLibrary(existing,incoming,mode){const next=validateLibrary(incoming);if(mode==='replace')return next;if(mode!=='merge')throw Error('Choose merge or replace.');const old=validateLibrary(existing);const maxMap=(a,b)=>Object.fromEntries([...new Set([...Object.keys(a||{}),...Object.keys(b||{})])].map(k=>[k,Math.max(a?.[k]||0,b?.[k]||0)]));const added=maxMap(old.watchlistAdded,next.watchlistAdded),removed=maxMap(old.watchlistRemoved,next.watchlistRemoved);return validateLibrary({watchlistAdded:added,watchlistRemoved:removed,statistics:{watchSecondsByDevice:maxMap(old.statistics.watchSecondsByDevice,next.statistics.watchSecondsByDevice)},watchlist:[...new Map([...old.watchlist,...next.watchlist].map(m=>[m.id,m])).values()].filter(m=>!removed[m.id]||(added[m.id]||0)>removed[m.id]),history:[...new Map([...old.history,...next.history].sort((a,b)=>a.at-b.at).map(h=>[h.media.id,h])).values()].sort((a,b)=>b.at-a.at).slice(0,100),statuses:{...old.statuses,...next.statuses},preferences:{...old.preferences,...next.preferences,player:{...old.preferences.player,...next.preferences.player}}});}
module.exports={validateLibrary,createBackup,parseBackup,restoreLibrary,STATUSES};

