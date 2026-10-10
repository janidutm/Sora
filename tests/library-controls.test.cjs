const {test}=require('node:test'),assert=require('node:assert/strict');
const {watchedSeconds}=require('../watch-time.js');
const {createBackup,parseBackup,restoreLibrary}=require('../backup.cjs');
const {removeJobFiles}=require('../download-files.cjs');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
test('watch time counts playing wall time, excluding seeking, buffering and long suspension',()=>{
 const start={wall:1000,position:10,playing:true,rate:2};
 assert.equal(watchedSeconds(start,{...start,wall:2000,position:12}),1);
 for(const next of [{wall:2000,position:100,playing:true},{wall:2000,position:12,playing:false},{wall:2000,position:10,playing:true},{wall:9000,position:26,playing:true}])assert.equal(watchedSeconds(start,{rate:2,...next}),0);
});
test('backup merge preserves removals and watch time without duplicating repeated imports',()=>{
 const media={id:1,title:{english:'Title'}};
 const old={watchlist:[media],history:[],statistics:{watchSecondsByDevice:{deviceA:120}},watchlistAdded:{1:10}};
 const incoming={watchlist:[],history:[],watchlistRemoved:{1:20},statistics:{watchSecondsByDevice:{deviceA:150,deviceB:30}},preferences:{downloadDirectory:path.resolve('work/custom')}};
 const roundtrip=parseBackup(JSON.parse(JSON.stringify(createBackup(incoming))));
 let merged=restoreLibrary(old,roundtrip,'merge');assert.equal(merged.watchlist.length,0);assert.equal(Object.values(merged.statistics.watchSecondsByDevice).reduce((a,b)=>a+b),180);
 merged=restoreLibrary(merged,roundtrip,'merge');assert.equal(Object.values(merged.statistics.watchSecondsByDevice).reduce((a,b)=>a+b),180);assert.equal(merged.preferences.downloadDirectory,incoming.preferences.downloadDirectory);
 const added=restoreLibrary(merged,{...old,watchlistAdded:{1:30}},'merge');assert.equal(added.watchlist.length,1);
});
test('cancellation removes only owned outputs, including legacy fragments, and keeps unrelated files',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'sora-files-'));
 try{const own=path.join(root,'sora-test');fs.mkdirSync(own);fs.writeFileSync(path.join(own,'video.mp4.part'),'x');fs.writeFileSync(path.join(root,'keep.mp4'),'x');removeJobFiles(root,{key:'test',directory:own,ownedFolder:true});assert(!fs.existsSync(own));assert(fs.existsSync(path.join(root,'keep.mp4')));
 for(const suffix of ['.mp4.part','.mp4.ytdl','.mp4.part-Frag1','.vtt'])fs.writeFileSync(path.join(root,'Episode'+suffix),'x');fs.writeFileSync(path.join(root,'Episode notes.txt'),'x');removeJobFiles(root,{file:'Episode'});assert.deepEqual(fs.readdirSync(root).sort(),['Episode notes.txt','keep.mp4']);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
