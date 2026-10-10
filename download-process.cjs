const {spawn}=require('node:child_process');
function stopTree(child){
  if(!child?.pid||child.exitCode!==null||child.signalCode!==null)return Promise.resolve();
  if(process.platform!=='win32'){
    try{if(child.soraProcessGroup)process.kill(-child.pid,'SIGKILL');else child.kill('SIGKILL');}
    catch(e){if(e.code!=='ESRCH')child.kill('SIGKILL');}
    return Promise.resolve();
  }
  return new Promise(resolve=>{
    const killer=spawn('taskkill',['/pid',String(child.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});
    killer.once('error',()=>{child.kill();resolve();});
    killer.once('close',code=>{if(code&&child.exitCode===null)child.kill();resolve();});
  });
}
function collect(child,{signal,timeout=55000,onOutput=()=>{}}={}){
  return new Promise((resolve,reject)=>{
    let output='',error='',failure;
    const abort=()=>{failure=signal?.reason||Error('Download cancelled.');void stopTree(child);};
    const timer=setTimeout(()=>{failure=Error('The source timed out. Retry in a moment.');void stopTree(child);},timeout);
    const cleanup=()=>{clearTimeout(timer);signal?.removeEventListener('abort',abort);};
    child.stdout.on('data',b=>{output+=b;if(!failure)onOutput(String(b));});
    child.stderr.on('data',b=>error=(error+b).slice(-2000));
    child.once('error',e=>{cleanup();reject(failure||e);});
    child.once('close',code=>{cleanup();if(failure)reject(failure);else if(code===0)resolve(output);else reject(Error(error||output||'Download interrupted.'));});
    signal?.addEventListener('abort',abort,{once:true});
    if(signal?.aborted)abort();
  });
}
module.exports={stopTree,collect};
