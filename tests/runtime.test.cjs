const {test}=require('node:test');
const assert=require('node:assert/strict');
const {runtime}=require('../runtime.cjs');
test('Linux resolves system tools and uses POSIX PATH without Windows paths',()=>{
 const r=runtime('/home/belu/Sora',{platform:'linux',home:'/home/belu',env:{PATH:'/usr/bin'},exists:()=>false});
 assert.equal(r.bash,'bash');assert.equal(r.ytdlp,'yt-dlp');assert.equal(r.mpv,'mpv');assert.equal(r.ffmpeg,null);
 assert.equal(r.env.PATH,'/home/belu/Sora/tools:/usr/bin');assert.equal(r.processOptions.detached,true);
});
test('Windows preserves portable tools and discovers home FFmpeg',()=>{
 const r=runtime('C:\\Sora',{platform:'win32',home:'C:\\Users\\Belu',env:{PATH:'C:\\Windows',ProgramFiles:'D:\\Apps'},exists:()=>true});
 assert.equal(r.bash,'D:\\Apps\\Git\\bin\\bash.exe');assert.equal(r.ytdlp,'C:\\Sora\\tools\\yt-dlp.exe');
 assert.equal(r.ffmpeg,'C:\\Users\\Belu\\ffmpeg\\bin');assert(r.env.PATH.includes(';'));assert.equal(r.processOptions.detached,false);
});
test('Explicit tool overrides work on either platform',()=>{
 const r=runtime('/sora',{platform:'linux',home:'/home/belu',env:{SORA_BASH:'/bin/bash',SORA_YTDLP:'/opt/yt-dlp',SORA_MPV:'/opt/mpv',SORA_FFMPEG_DIR:'/opt/ffmpeg',PATH:'/bin'},exists:()=>false});
 assert.equal(r.bash,'/bin/bash');assert.equal(r.ytdlp,'/opt/yt-dlp');assert.equal(r.mpv,'/opt/mpv');assert.equal(r.ffmpeg,'/opt/ffmpeg');
});
