process.env.SORA_TEST='1';
const {app}=require('electron');const main=require('../main.cjs');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const report={};const wait=ms=>new Promise(r=>setTimeout(r,ms));async function until(fn,ms=15000){const start=Date.now();while(Date.now()-start<ms){if(await fn())return;await wait(150);}throw Error('Experience check timed out');}
const watchdog=setTimeout(()=>app.exit(1),90000);
app.whenReady().then(async()=>{let original,js;try{await until(()=>main.getWindow());const win=main.getWindow();await until(()=>!win.webContents.isLoading());js=s=>win.webContents.executeJavaScript(`(async()=>{return await (${s})})()`);await until(()=>js('!!library.preferences'));
  original=await js('call("state")');
  await js('setPlayerFullscreen(true)');await until(()=>win.isFullScreen());assert(await js('document.querySelector("#player").classList.contains("native-fullscreen")'));report.nativeFullscreen='passed: Electron window entered fullscreen';
  await js('setPlayerFullscreen(false)');await until(()=>!win.isFullScreen());report.fullscreenExit='passed';
  await js('nav("backup")');assert(await js('document.querySelector("#export-backup")!==null'));await js('nav("watchlist")');await js('traversePage(-1)');assert.equal(await js('view'),'backup');await js('traversePage(1)');assert.equal(await js('view'),'watchlist');report.backForward='passed';
  const sample={watchlist:[{id:1,title:{english:'Cowboy Bebop'},status:'FINISHED'}],history:[{media:{id:1,title:{english:'Cowboy Bebop'}},episode:'3',provider:'cowboy-bebop-1281',position:72,at:123,mode:'sub',quality:'best'}],statuses:{1:'watching'},preferences:{player:{speed:'1.5','caption-size':'36'}}};
  const exported=await js(`call('exportBackup',${JSON.stringify(sample)})`);assert(fs.existsSync(exported.file));const incoming=await js('call("importBackup")');assert.equal(incoming.history[0].position,72);report.backupExportImport='passed';
  const replaced=await js(`call('restoreBackup',{library:${JSON.stringify(incoming)},mode:'replace'})`);assert.equal(replaced.watchlist.length,1);assert.equal(replaced.preferences.player.speed,'1.5');const snapshots=path.join(__dirname,'../work/smoke-data/restore-snapshots');assert(fs.readdirSync(snapshots).length>0);report.restoreWithSafetyCopy='passed';
  await js('nav("home")');await until(()=>js('home.length>0'));assert(await js('document.querySelector("#surprise-me")!==null'));report.homeFeatures='passed';
  const schedule=await js('call("schedule")');assert(Array.isArray(schedule));report.airingSchedule=`passed: ${schedule.length} upcoming episodes`;
  report.ok=true;
}catch(error){report.ok=false;report.error=error.stack;}finally{if(original&&js){try{await js(`call('save',${JSON.stringify({watchlist:original.watchlist,history:original.history,statuses:original.statuses||{},preferences:original.preferences||{}})})`);}catch{}}clearTimeout(watchdog);fs.writeFileSync(path.join(__dirname,'../docs/experience-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));app.quit();setTimeout(()=>app.exit(report.ok?0:1),1000);}});
