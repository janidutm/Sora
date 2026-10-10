const fs=require('node:fs'),path=require('node:path');
function jobFolder(defaultFolder,job){return path.resolve(job.directory||defaultFolder);}
function removeJobFiles(defaultFolder,job){
 const root=jobFolder(defaultFolder,job);
 if(!fs.existsSync(root))return;
 if(fs.lstatSync(root).isSymbolicLink())throw Error('Download folder is a link; choose a regular folder.');
 if(job.ownedFolder===true&&path.basename(root)===`sora-${job.key}`){
  for(const name of fs.readdirSync(root)){const file=path.resolve(root,name);if(path.dirname(file)!==root)throw Error('Invalid download file.');if(fs.lstatSync(file).isDirectory())throw Error('Unexpected subfolder in episode download.');fs.unlinkSync(file);}
  fs.rmdirSync(root);return;
 }
 // Legacy downloads share a directory. Only remove this episode's known outputs.
 const base=job.file||require('./lib.cjs').safeFilename(`${job.title} Episode ${job.episode}`);
 for(const name of fs.readdirSync(root)){
  if(!name.startsWith(base+'.')||!/^\.(?:f\d+\.)?(?:mp4|mkv|webm|mov|m4v|vtt|srt|ytdl)(?:\.(?:part(?:-Frag\d+)?|ytdl))?$/.test(name.slice(base.length)))continue;
  const file=path.resolve(root,name);if(path.dirname(file)===root&&!fs.lstatSync(file).isDirectory())fs.unlinkSync(file);
 }
}
module.exports={jobFolder,removeJobFiles};
