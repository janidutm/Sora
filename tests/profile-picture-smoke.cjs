process.env.SORA_TEST='1';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const data=path.join(__dirname,'../work/smoke-data');fs.mkdirSync(data,{recursive:true});fs.writeFileSync(path.join(data,'library.json'),JSON.stringify({watchlist:[],history:[],preferences:{username:'Janidu'}}));
const {app}=require('electron'),main=require('../main.cjs'),report={};
const wait=ms=>new Promise(r=>setTimeout(r,ms));async function until(fn){for(let n=0;n<300;n++){if(await fn())return;await wait(100);}throw Error('Picture check timed out');}
const watchdog=setTimeout(()=>app.exit(1),60000);
app.whenReady().then(async()=>{try{
 await until(()=>main.getWindow());const win=main.getWindow();await until(()=>!win.webContents.isLoading());const js=s=>win.webContents.executeJavaScript(s);
 await until(()=>js('document.querySelector("#profile-button").textContent==="J"'));
 await js('document.querySelector("#profile-button").click();true');
 await js(`(async()=>{const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;const ctx=canvas.getContext('2d');ctx.fillStyle='#8ac9b2';ctx.fillRect(0,0,512,256);ctx.fillStyle='#eab788';ctx.fillRect(230,40,50,176);const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));const transfer=new DataTransfer();transfer.items.add(new File([blob],'test-avatar.png',{type:'image/png'}));const input=document.querySelector('#profile-picture-file');input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));return true})()`);
 await until(()=>js('!!document.querySelector("#profile-picture-preview img") && !profilePictureBusy'));
 assert.equal(await js('(async()=>{const img=document.querySelector("#profile-picture-preview img");await img.decode();return img.naturalWidth})()'),256);report.resizeAndPreview=true;
 await js('document.querySelector("#profile-form").requestSubmit();true');await until(()=>js('!!document.querySelector("#profile-button img")'));
 const picture=JSON.parse(fs.readFileSync(path.join(data,'library.json'))).preferences.profilePicture;assert.match(picture,/^data:image\/png;base64,/);report.savedPicture=true;
 await js('call("exportBackup",library)');const backup=JSON.parse(fs.readFileSync(path.join(data,'test-backup.json')));assert.equal(backup.library.preferences.profilePicture,picture);report.backupEmbedsPicture=true;
 await new Promise(resolve=>{win.webContents.once('did-finish-load',resolve);win.webContents.reload();});await until(()=>js('!!document.querySelector("#profile-button img")'));report.reloadPersistsPicture=true;
 await js('document.querySelector("#profile-button").click();document.querySelector("#remove-profile-picture").click();document.querySelector("#profile-later").click();true');assert(await js('!!document.querySelector("#profile-button img")'));report.cancelPreservesPicture=true;
 await js('document.querySelector("#profile-button").click();document.querySelector("#remove-profile-picture").click();document.querySelector("#profile-form").requestSubmit();true');await until(()=>js('document.querySelector("#profile-button").textContent==="J"'));assert.equal(JSON.parse(fs.readFileSync(path.join(data,'library.json'))).preferences.profilePicture,'');report.removeReturnsInitial=true;
 await js('(async()=>{const incoming=await call("importBackup");library=await call("restoreBackup",{library:incoming,mode:"replace"});applyPreferences();return true})()');await until(()=>js('!!document.querySelector("#profile-button img")'));assert.equal(await js('library.preferences.profilePicture'),picture);report.restorePicture=true;
 assert.equal(await js('call("openDeveloper")'),'https://github.com/janidutm');
 await js('window.creditOpened=[];window.originalProfileCall=call;call=async function(method,...args){const result=await window.originalProfileCall(method,...args);if(method==="openDeveloper")window.creditOpened.push(result);return result};nav("about");true');
 assert((await js('document.querySelectorAll("[data-developer-link]").length'))>=5);
 await js('document.querySelectorAll("[data-developer-link]").forEach(a=>a.click());true');await until(()=>js('window.creditOpened.length>=5'));assert(await js('window.creditOpened.every(url=>url==="https://github.com/janidutm")'));report.creditLinksUseGithub=true;
 await js('document.querySelector("#profile-button").click();true');await js('document.querySelector("#profile-picture-preview img").decode()');win.showInactive();await wait(400);fs.writeFileSync(path.join(__dirname,'../docs/profile-picture-preview.png'),(await win.webContents.capturePage()).toPNG());report.ok=true;
 }catch(e){report.ok=false;report.error=e.stack;}finally{clearTimeout(watchdog);fs.writeFileSync(path.join(__dirname,'../docs/profile-picture-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));app.exit(report.ok?0:1);}});
