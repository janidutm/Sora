const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
function runtime(root,{platform=process.platform,env=process.env,exists=fs.existsSync,home=os.homedir()}={}){
  const windows=platform==='win32',p=windows?path.win32:path.posix;
  const localFfmpeg=p.join(home,'ffmpeg','bin');
  const ffmpeg=env.SORA_FFMPEG_DIR||(exists(p.join(localFfmpeg,windows?'ffmpeg.exe':'ffmpeg'))?localFfmpeg:null);
  const portableYtdlp=p.join(root,'tools',windows?'yt-dlp.exe':'yt-dlp');
  const portableMpv=p.join(root,'tools','mpv',windows?'mpv.exe':'mpv');
  return {
    bash:env.SORA_BASH||(windows?p.join(env.ProgramFiles||'C:\\Program Files','Git','bin','bash.exe'):'bash'),
    ffmpeg,
    ytdlp:env.SORA_YTDLP||(exists(portableYtdlp)?portableYtdlp:'yt-dlp'),
    mpv:env.SORA_MPV||(exists(portableMpv)?portableMpv:'mpv'),
    env:{...env,PATH:[p.join(root,'tools'),ffmpeg,env.PATH].filter(Boolean).join(windows?';':':'),TERM:'dumb'},
    processOptions:{windowsHide:true,detached:!windows}
  };
}
function spawnManaged(spawn,exe,args,options={}){
  const child=spawn(exe,args,{...options,detached:process.platform!=='win32'});
  child.soraProcessGroup=process.platform!=='win32';
  return child;
}
module.exports={runtime,spawnManaged};
