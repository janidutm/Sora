const fs=require('node:fs'),path=require('node:path');
function subtitleVtt(text){
 text=String(text).replace(/^\uFEFF/,'').replace(/\r\n/g,'\n');
 if(text.trimStart().startsWith('WEBVTT'))return text;
 if(!/\d{2}:\d{2}:\d{2},\d{3}\s+-->/.test(text))throw Error('Unsupported subtitle format. Choose VTT or SRT.');
 return 'WEBVTT\n\n'+text.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g,'$1.$2');
}
function localTracks(folder,job){
 const tracks=[...(job.subtitles||[])];
 for(const ext of ['vtt','srt'])if(job.file)tracks.push({file:job.file+'.'+ext,label:'English',language:'en',default:true});
 const seen=new Set();return tracks.filter(t=>{if(typeof t.file!=='string'||path.basename(t.file)!==t.file||!/\.(vtt|srt)$/i.test(t.file))return false;const file=path.resolve(folder,t.file);if(seen.has(file)||!fs.existsSync(file)||!fs.statSync(file).isFile())return false;seen.add(file);return true;});
}
function serveFile(req,res,file,type){
 const size=fs.statSync(file).size;let start=0,end=size-1,status=200;
 if(req.headers.range){const match=req.headers.range.match(/^bytes=(\d*)-(\d*)$/);if(!match||(!match[1]&&!match[2])){res.writeHead(416,{'Content-Range':`bytes */${size}`});return res.end();}
 if(!match[1])start=Math.max(0,size-Number(match[2]));else{start=Number(match[1]);if(match[2])end=Math.min(end,Number(match[2]));}
 if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>end||start>=size){res.writeHead(416,{'Content-Range':`bytes */${size}`});return res.end();}status=206;}
 const headers={'Content-Type':type,'Content-Length':end-start+1,'Accept-Ranges':'bytes','Access-Control-Allow-Origin':'*','Cache-Control':'no-store'};if(status===206)headers['Content-Range']=`bytes ${start}-${end}/${size}`;
 res.writeHead(status,headers);if(req.method==='HEAD')return res.end();const stream=fs.createReadStream(file,{start,end});res.on('close',()=>stream.destroy());stream.on('error',()=>res.destroy());stream.pipe(res);
}
module.exports={subtitleVtt,localTracks,serveFile};
