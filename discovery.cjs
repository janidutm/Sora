const fs=require('node:fs');const path=require('node:path');
function localDay(date=new Date()){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');}
function isDailyFresh(value,date=new Date()){return value?.day===localDay(date)&&Array.isArray(value.trending)&&value.trending.length>0;}
function makeDiscovery({data,fields,onUpdate=()=>{},fetcher=fetch,now=()=>new Date()}){
  const file=path.join(data,'discovery.json');let pending;
  function read(){try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch{return null;}}
  async function refresh(){if(pending)return pending;pending=(async()=>{const date=now(),year=date.getFullYear();const query=`query{trending:Page(perPage:18){media(type:ANIME,isAdult:false,status_not:NOT_YET_RELEASED,sort:TRENDING_DESC){${fields}}}popular:Page(perPage:12){media(type:ANIME,isAdult:false,startDate_greater:${(year-1)*10000+101},status_not:NOT_YET_RELEASED,sort:POPULARITY_DESC){${fields}}}upcoming:Page(perPage:12){media(type:ANIME,isAdult:false,status:NOT_YET_RELEASED,startDate_greater:${year*10000+(date.getMonth()+1)*100+date.getDate()-1},sort:START_DATE){${fields}}}}`;
    const response=await fetcher('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query}),signal:AbortSignal.timeout(18000)});const json=await response.json();if(!response.ok||json.errors)throw Error(json.errors?.[0]?.message||'Daily discovery is temporarily unavailable.');
    const value={day:localDay(date),updatedAt:date.toISOString(),trending:json.data.trending.media,popular:json.data.popular.media,upcoming:json.data.upcoming.media};if(!value.trending.length)throw Error('No discovery titles returned.');fs.writeFileSync(file+'.tmp',JSON.stringify(value));fs.renameSync(file+'.tmp',file);onUpdate({...value,stale:false});return {...value,stale:false};})().finally(()=>pending=null);return pending;}
  async function get(force=false){let old=read();if(force)return refresh();if(old){if(!isDailyFresh(old,now()))void refresh().catch(()=>{});return {...old,stale:!isDailyFresh(old,now())};}
    try{const legacy=JSON.parse(fs.readFileSync(path.join(data,'home.json'),'utf8'));if(legacy.length){old={day:'',updatedAt:fs.statSync(path.join(data,'home.json')).mtime.toISOString(),trending:legacy,popular:[],upcoming:[]};void refresh().catch(()=>{});return {...old,stale:true};}}catch{}return refresh();}
  return {get,refresh};
}
function safeDownloadedFile(downloads,job){if(job?.status!=='complete')return null;const root=path.resolve(downloads);if(!fs.existsSync(root))return null;const allowed=/\.(mp4|mkv|webm|mov|m4v)$/i;const names=job.filePath?[job.filePath]:fs.readdirSync(root).filter(n=>n.startsWith((job.file||'')+'.')&&allowed.test(n));for(const name of names){const target=path.resolve(root,name);if(path.dirname(target)!==root||!allowed.test(target))continue;try{if(fs.statSync(target).isFile())return target;}catch{}}return null;}
module.exports={localDay,isDailyFresh,makeDiscovery,safeDownloadedFile};

