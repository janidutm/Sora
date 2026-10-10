// Opt-in network integration test. Runs in a hidden window and isolated data/download folders.
process.env.SORA_TEST='1';
const {app}=require('electron'); const assert=require('node:assert/strict'); const fs=require('node:fs');const path=require('node:path');
const main=require('../main.cjs'); const report={};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function until(fn,ms=60000){const start=Date.now();while(Date.now()-start<ms){const result=await fn();if(result)return result;await wait(500);}throw Error('Timed out waiting for integration condition.');}
const watchdog=setTimeout(()=>{console.error('Integration watchdog expired');app.exit(1);},240000);
app.whenReady().then(async()=>{try{
  const win=await until(()=>main.getWindow());await until(()=>!win.webContents.isLoading());const js=async s=>{const result=await win.webContents.executeJavaScript(`(async()=>{try{return {value:await (${s})}}catch(e){return {failure:e.stack}}})()`);if(result.failure)throw Error(result.failure);return result.value;};await until(()=>js('typeof openDetail === "function"'));
  const catalogue=await main.catalogue('Cowboy Bebop');assert(catalogue.some(m=>m.id===1));report.artworkSearch='passed';
  const source=await main.bridge('search','cowboy%20bebop');assert(source.includes('cowboy-bebop-1281'));report.sourceSearch='passed';
  const eps=await main.bridge('episodes','cowboy-bebop-1281');assert(eps.includes('\t26'));report.episodeListing='passed';
  await js(`openDetail(${JSON.stringify(catalogue.find(m=>m.id===1))})`);await until(()=>js('episodes.length > 0 && provider?.id === "cowboy-bebop-1281"'));report.metadataMapping='passed';
  // Save/restore library through the isolated renderer IPC path.
  await js('saved(current.id) || toggleSave(current)');await wait(800);assert(await js('saved(1)'));report.watchlist='passed';
  await until(()=>js('related.length>0'));report.relations='passed';assert(await js('document.querySelectorAll("[data-download-episode]").length===26'));report.individualEpisodeButtons='passed';
  const cold=Date.now();await js('call("episodes",provider.id)');report.cachedEpisodeLookupMs=Date.now()-cold;
  assert(await js('!document.querySelector("#source")'));report.automaticEdition='passed';await js('document.querySelectorAll("[data-episode]")[0].click()');const playback=await until(()=>js('document.querySelector("#video")?.currentTime > 2'),85000).catch(()=>false);assert(playback,'Episode click did not autoplay');report.episodeClickAutoplay='passed';report.embeddedPlayback=playback?'passed: media time advanced beyond 2 seconds':await js('document.querySelector("#player-status")?.textContent');
  assert(await js('document.querySelector("#player-quality").options.length>1'));report.qualityMenu='passed';await js('(()=>{document.querySelector("#speed").value="1.5";document.querySelector("#speed").dispatchEvent(new Event("change",{bubbles:true}));return true})()');assert.equal(await js('document.querySelector("#video").playbackRate'),1.5);report.speedControl='passed';await until(()=>js('document.querySelector("#video").textTracks[0]?.cues?.length>0'),20000);report.subtitleCues='passed';
  await js('setPlayerFullscreen(true)');await until(()=>main.getWindow().isFullScreen(),15000);report.playingFullscreen='passed';await js('document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}))');await until(()=>!main.getWindow().isFullScreen());assert(await js('!!playerReq && !!document.querySelector("#video")'));report.escapeKeepsPlayer='passed';
  await js('closePlayer()');
  const request={id:'cowboy-bebop-1281',title:'Sora smoke test',episodes:['1'],mode:'sub',quality:'best'};
  const queued=await js(`window.sora.enqueue(${JSON.stringify(request)})`);assert(queued.ok);
  const job=await until(()=>{const job=main.getQueue().find(j=>['queued','resolving','downloading','error'].includes(j.status));if(job?.status==='error')throw Error(job.error);return job?.status==='downloading'&&job.progress>0?job:null;},85000);report.downloadTransfer=`passed: yt-dlp reported ${job.progress}%`;
  const downloadPid=job.child.pid;const cancelled=await js(`window.sora.cancel(${JSON.stringify(job.key)})`);assert(cancelled.ok);await until(()=>main.getQueue().find(j=>j.key===job.key).status==='cancelled'&&!job.child);assert.throws(()=>process.kill(downloadPid,0));const stoppedProgress=job.progress;await wait(1000);assert.equal(job.progress,stoppedProgress);report.downloadCancel='passed: downloader exited and progress stopped';
  report.ok=true;
}catch(e){report.ok=false;report.error=e.stack;}finally{clearTimeout(watchdog);fs.writeFileSync(path.join(__dirname,'../docs/live-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));app.quit();setTimeout(()=>app.exit(report.ok?0:1),1500);}});
