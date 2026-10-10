let profilePictureDraft='',profilePictureBusy=false,profileSession=0;
function developerCredit(label='Developed by Belu'){return `<a href="https://github.com/janidutm" class="developer-link" data-developer-link title="Belu on GitHub">${esc(label)}</a>`;}
function profilePortrait(element,picture,name){
  element.replaceChildren();
  if(picture){const img=document.createElement('img');img.src=picture;img.alt='';element.append(img);}
  else element.textContent=SoraProfile.initial(name);
}
function renderProfile(){
  const name=SoraProfile.username(library.preferences.username),button=document.querySelector('#profile-button');
  profilePortrait(button,SoraProfile.picture(library.preferences.profilePicture),name);
  button.title=name?`${name} · Edit profile`:'Set your username';
  button.setAttribute('aria-label',name?`Edit profile for ${name}`:'Set your username');
}
function closeProfile(){profileSession++;document.querySelector('#modal').classList.add('hidden');document.querySelector('#profile-button').focus();}
function updateProfilePreview(){const preview=document.querySelector('#profile-picture-preview');if(!preview)return;profilePortrait(preview,profilePictureDraft,document.querySelector('#profile-name').value);document.querySelector('#remove-profile-picture').disabled=profilePictureBusy||!profilePictureDraft;document.querySelector('#choose-profile-picture').disabled=profilePictureBusy;}
function openProfile(){
  profileSession++;profilePictureBusy=false;profilePictureDraft=SoraProfile.picture(library.preferences.profilePicture);
  const name=SoraProfile.username(library.preferences.username),modal=document.querySelector('#modal');
  modal.innerHTML=`<section class="dialog profile-dialog" aria-labelledby="profile-heading"><div class="eyebrow">YOUR LITTLE CORNER</div><h2 id="profile-heading">${name?'Make yourself at home.':'What should we call you?'}</h2><p>Your name and picture stay on this computer and travel with your library backups. No account or password needed.</p><form id="profile-form"><div class="profile-picture-row"><div id="profile-picture-preview" class="profile-picture-preview" aria-label="Profile picture preview"></div><div><button class="button small" type="button" id="choose-profile-picture">Choose picture</button><button class="button small" type="button" id="remove-profile-picture">Remove picture</button><p class="muted">PNG, JPG or WebP · up to 10 MB</p></div></div><input type="file" id="profile-picture-file" accept="image/png,image/jpeg,image/webp" hidden><label for="profile-name">Username</label><input id="profile-name" name="username" autocomplete="nickname" placeholder="Your name" value="${esc(name)}" required aria-describedby="profile-hint profile-error"><p id="profile-hint" class="muted">Up to 32 characters. Change your name or picture anytime using your profile button.</p><p id="profile-error" role="alert"></p><div class="actions"><button class="button" type="button" id="profile-later">${name?'Cancel':'Later'}</button><button class="button primary" type="submit">${name?'Save profile':'Let’s begin'}</button></div></form></section>`;
  modal.classList.remove('hidden');updateProfilePreview();document.querySelector('#profile-name').focus();
}
document.addEventListener('click',event=>{
  if(event.target.closest('[data-developer-link]')){event.preventDefault();void call('openDeveloper').catch(e=>notify(e.message));}
  if(event.target.closest('#profile-button'))openProfile();
  if(event.target.closest('#profile-later'))closeProfile();
  if(event.target.closest('#choose-profile-picture'))document.querySelector('#profile-picture-file').click();
  if(event.target.closest('#remove-profile-picture')){profilePictureDraft='';document.querySelector('#profile-picture-file').value='';updateProfilePreview();}
});
document.addEventListener('input',event=>{if(event.target.id==='profile-name')updateProfilePreview();});
document.addEventListener('change',async event=>{
  if(event.target.id!=='profile-picture-file')return;
  const file=event.target.files?.[0];if(!file)return;
  const session=profileSession,error=document.querySelector('#profile-error'),submit=document.querySelector('#profile-form [type=submit]');
  profilePictureBusy=true;submit.disabled=true;updateProfilePreview();error.textContent='Preparing your picture…';let bitmap;
  try{
    if(file.size>10*1024*1024||!['image/png','image/jpeg','image/webp'].includes(file.type))throw Error('Choose a PNG, JPG or WebP image smaller than 10 MB.');
    bitmap=await createImageBitmap(file);
    if(!bitmap.width||!bitmap.height||bitmap.width*bitmap.height>32000000)throw Error('Choose an image with fewer than 32 million pixels.');
    const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
    const size=Math.min(bitmap.width,bitmap.height);canvas.getContext('2d').drawImage(bitmap,(bitmap.width-size)/2,(bitmap.height-size)/2,size,size,0,0,256,256);
    const picture=SoraProfile.picture(canvas.toDataURL('image/png'));if(!picture)throw Error('Could not prepare that picture. Try another image.');
    if(session!==profileSession)return;profilePictureDraft=picture;error.textContent='Picture ready. Save profile to keep it.';updateProfilePreview();
  }catch(e){if(session===profileSession)error.textContent=e.message;}
  finally{bitmap?.close();if(session===profileSession){profilePictureBusy=false;submit.disabled=false;updateProfilePreview();}}
});
document.addEventListener('submit',async event=>{
  if(event.target.id!=='profile-form')return;event.preventDefault();if(profilePictureBusy)return;
  const name=SoraProfile.username(document.querySelector('#profile-name').value),error=document.querySelector('#profile-error');
  if(!name){error.textContent='Enter a name with 1–32 characters, without hidden control characters.';return;}
  const previous={username:library.preferences.username,picture:library.preferences.profilePicture},submit=event.target.querySelector('[type=submit]');submit.disabled=true;
  library.preferences.username=name;library.preferences.profilePicture=profilePictureDraft;clearTimeout(saveTimer);
  try{await call('save',library);renderProfile();closeProfile();notify(`Welcome, ${name}.`);}
  catch(e){library.preferences.username=previous.username;library.preferences.profilePicture=previous.picture;error.textContent=e.message;submit.disabled=false;}
});
document.addEventListener('keydown',event=>{
  const form=document.querySelector('#profile-form');if(!form||document.querySelector('#modal').classList.contains('hidden'))return;
  if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();closeProfile();}
  if(event.key==='Tab'){const controls=[...form.querySelectorAll('input:not([hidden]),button')].filter(el=>!el.disabled);const first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
});
