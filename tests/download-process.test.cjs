const {test}=require('node:test');
const assert=require('node:assert/strict');
const {spawn:rawSpawn}=require('node:child_process');
const {runtime,spawnManaged}=require('../runtime.cjs');
const spawn=(exe,args,options)=>spawnManaged(rawSpawn,exe,args,options);
const {collect}=require('../download-process.cjs');
test('actual yt-dlp cancellation closes a partial transfer and preserves resumable files',async()=>{
 const http=require('node:http'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
 const folder=fs.mkdtempSync(path.join(os.tmpdir(),'sora-cancel-'));let sent=0,closed=false;
 const server=http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'video/mp4','Content-Length':8*1024*1024});const timer=setInterval(()=>{sent+=8192;res.write(Buffer.alloc(8192));},30);res.on('close',()=>{clearInterval(timer);closed=true;});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 try{
  const child=spawn(runtime(path.join(__dirname,'..')).ytdlp,['--newline','--no-colors','-o',path.join(folder,'episode.mp4'),`http://127.0.0.1:${server.address().port}/episode.mp4`],{windowsHide:true});
  const controller=new AbortController();let progress=false;
  await assert.rejects(collect(child,{signal:controller.signal,timeout:20000,onOutput:s=>{if(/\[download\]\s+[\d.]+%/.test(s)){progress=true;controller.abort(Error('User cancelled transfer'));}}}),/User cancelled transfer/);
  assert(progress);assert(child.exitCode!==null||child.signalCode!==null);
  await new Promise(r=>setTimeout(r,200));assert(closed);const stopped=sent;
  await new Promise(r=>setTimeout(r,200));assert.equal(sent,stopped);
  assert(fs.readdirSync(folder).some(f=>f.endsWith('.part')));
 }finally{server.closeAllConnections();await new Promise(r=>server.close(r));fs.rmSync(folder,{recursive:true,force:true});}
});
test('cancellation terminates a running process and its descendant before settling',async()=>{
 const child=spawn(process.execPath,['-e',`const {spawn}=require('node:child_process');const c=spawn(process.execPath,['-e','setInterval(()=>{},1000)'],{stdio:'ignore'});console.log(c.pid);setInterval(()=>console.log('working'),100);`],{windowsHide:true});
 const controller=new AbortController();let descendant;
 const result=collect(child,{signal:controller.signal,onOutput:s=>{descendant??=Number(s.trim().split('\n')[0]);if(descendant)controller.abort(Error('Cancelled by user'));}});
 await assert.rejects(result,/Cancelled by user/);
 assert(child.exitCode!==null||child.signalCode!==null);
 if(process.platform==='linux'){const fs=require('node:fs');const stat=fs.existsSync(`/proc/${descendant}/stat`)?fs.readFileSync(`/proc/${descendant}/stat`,'utf8'):'';assert(!stat||/\) Z /.test(stat));}else assert.throws(()=>process.kill(descendant,0));
});
test('already aborted preparation is stopped without delivering progress',async()=>{
 const child=spawn(process.execPath,['-e','setInterval(()=>console.log("late"),10)'],{windowsHide:true});
 const controller=new AbortController();controller.abort(Error('cancelled'));let updates=0;
 await assert.rejects(collect(child,{signal:controller.signal,onOutput:()=>updates++}),/cancelled/);
 assert.equal(updates,0);assert(child.exitCode!==null||child.signalCode!==null);
});
