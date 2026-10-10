process.env.SORA_TEST='1';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const data=path.join(__dirname,'../work/smoke-data');fs.mkdirSync(data,{recursive:true});fs.writeFileSync(path.join(data,'library.json'),JSON.stringify({watchlist:[],history:[],preferences:{}}));
const {app}=require('electron'),main=require('../main.cjs'),report={};
const wait=ms=>new Promise(r=>setTimeout(r,ms));async function until(fn){for(let n=0;n<300;n++){if(await fn())return;await wait(100);}throw Error('Profile check timed out');}
const watchdog=setTimeout(()=>app.exit(1),60000);
app.whenReady().then(async()=>{try{
 await until(()=>main.getWindow());const win=main.getWindow();await until(()=>!win.webContents.isLoading());
 const js=s=>win.webContents.executeJavaScript(s);
 await until(()=>js('!!document.querySelector("#profile-form")'));
 assert.equal(await js('document.querySelector("#profile-button").textContent'),'?');report.firstLaunchPrompt=true;
 await js('document.querySelector("#profile-name").value="Janidu";document.querySelector("#profile-form").requestSubmit();true');
 await until(()=>js('document.querySelector("#profile-button").textContent==="J"'));assert.equal(JSON.parse(fs.readFileSync(path.join(data,'library.json'))).preferences.username,'Janidu');report.savedInitial=true;
 await js('document.querySelector("#profile-button").click();document.querySelector("#profile-name").value="a".repeat(33);document.querySelector("#profile-form").requestSubmit();true');
 await until(()=>js('!!document.querySelector("#profile-error").textContent'));assert.equal(JSON.parse(fs.readFileSync(path.join(data,'library.json'))).preferences.username,'Janidu');report.invalidNameDoesNotSave=true;
 await js('document.querySelector("#profile-name").value="<img src=x>";document.querySelector("#profile-form").requestSubmit();true');await until(()=>js('document.querySelector("#profile-button").textContent==="<"'));
 await js('document.querySelector("#profile-button").click();true');assert.equal(await js('document.querySelector("#profile-name").value'),'<img src=x>');assert.equal(await js('document.querySelectorAll(".profile-dialog img").length'),0);report.markupEscaped=true;
 await js('document.querySelector("#profile-name").value="みらい";document.querySelector("#profile-form").requestSubmit();true');await until(()=>js('document.querySelector("#profile-button").textContent==="み"'));
 await new Promise(resolve=>{win.webContents.once('did-finish-load',resolve);win.webContents.reload();});
 await until(()=>js('document.querySelector("#profile-button").textContent==="み"'));assert(await js('document.querySelector("#modal").classList.contains("hidden")'));report.persistedAfterReload=true;
 await js('document.querySelector("#profile-button").click();true');assert.equal(await js('document.activeElement.id'),'profile-name');report.editableAndFocused=true;
 fs.writeFileSync(path.join(__dirname,'../docs/profile-preview.png'),(await win.webContents.capturePage()).toPNG());report.ok=true;
 }catch(e){report.ok=false;report.error=e.stack;}finally{clearTimeout(watchdog);fs.writeFileSync(path.join(__dirname,'../docs/profile-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));app.exit(report.ok?0:1);}});
