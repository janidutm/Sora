process.env.SORA_TEST='1';
const {app}=require('electron'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const main=require('../main.cjs'),report={};const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function until(fn,ms=20000){const start=Date.now();while(Date.now()-start<ms){if(await fn())return;await wait(100);}throw Error('Condition timed out');}
app.whenReady().then(async()=>{try{
 await until(()=>main.getWindow());const win=main.getWindow();await until(()=>!win.webContents.isLoading());
 const js=s=>win.webContents.executeJavaScript(`(async()=>(${s}))()`);
 await until(()=>js('typeof renderDownloads==="function"'));
 const req={id:'cowboy-bebop-1281',title:'Cancellation regression',episodes:['23','24','25'],mode:'sub',quality:'best'};
 assert((await js(`window.sora.enqueue(${JSON.stringify(req)})`)).ok);
 const jobs=main.getQueue().filter(j=>j.title===req.title&&['queued','resolving'].includes(j.status));assert.equal(jobs.length,3);
 assert((await js(`window.sora.cancel('${jobs[2].key}')`)).ok);report.queuedCancel='passed';
 const start=Date.now();assert((await js(`window.sora.cancel('${jobs[0].key}')`)).ok);
 await until(()=>jobs[1].status==='resolving'||jobs[1].status==='downloading');report.preparationCancelAndQueueAdvanceMs=Date.now()-start;
 assert((await js(`window.sora.cancel('${jobs[1].key}')`)).ok);await wait(700);
 assert(jobs.every(j=>j.status==='cancelled'));assert(!jobs.some(j=>j.child));report.repeatCancel=(await js(`window.sora.cancel('${jobs[0].key}')`)).ok;
 assert(await js(`(()=>{view='downloads';queue=[{key:'stable',title:'Click test',episode:'1',mode:'sub',status:'downloading',progress:1}];renderDownloads();const button=document.querySelector('[data-cancel]');queue[0].progress=2;updateDownloads();return button===document.querySelector('[data-cancel]')&&document.querySelector('.download-progress').textContent==='2%';})()`));report.stableCancelButton='passed';report.ok=true;
 }catch(e){report.ok=false;report.error=e.stack;}finally{fs.writeFileSync(path.join(__dirname,'../docs/download-cancel-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));app.quit();}});
setTimeout(()=>app.exit(1),45000).unref();
