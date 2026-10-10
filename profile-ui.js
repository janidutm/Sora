function renderProfile(){
  const name=SoraProfile.username(library.preferences.username),button=document.querySelector('#profile-button');
  button.textContent=SoraProfile.initial(name);
  button.title=name?`${name} · Edit profile`:'Set your username';
  button.setAttribute('aria-label',name?`Edit profile for ${name}`:'Set your username');
}
function closeProfile(){document.querySelector('#modal').classList.add('hidden');document.querySelector('#profile-button').focus();}
function openProfile(){
  const name=SoraProfile.username(library.preferences.username),modal=document.querySelector('#modal');
  modal.innerHTML=`<section class="dialog profile-dialog" aria-labelledby="profile-heading"><div class="eyebrow">YOUR LITTLE CORNER</div><h2 id="profile-heading">${name?'Make yourself at home.':'What should we call you?'}</h2><p>Your username appears in your profile. It stays on this computer and is included in library backups. No account or password needed.</p><form id="profile-form"><label for="profile-name">Username</label><input id="profile-name" name="username" autocomplete="nickname" placeholder="Your name" value="${esc(name)}" required aria-describedby="profile-hint profile-error"><p id="profile-hint" class="muted">Up to 32 characters. You can change it anytime using your profile button.</p><p id="profile-error" role="alert"></p><div class="actions"><button class="button" type="button" id="profile-later">${name?'Cancel':'Later'}</button><button class="button primary" type="submit">${name?'Save username':'Let’s begin'}</button></div></form></section>`;
  modal.classList.remove('hidden');document.querySelector('#profile-name').focus();
}
document.addEventListener('click',event=>{
  if(event.target.closest('#profile-button'))openProfile();
  if(event.target.closest('#profile-later'))closeProfile();
});
document.addEventListener('submit',async event=>{
  if(event.target.id!=='profile-form')return;event.preventDefault();
  const name=SoraProfile.username(document.querySelector('#profile-name').value),error=document.querySelector('#profile-error');
  if(!name){error.textContent='Enter a name with 1–32 characters, without hidden control characters.';return;}
  const previous=library.preferences.username,submit=event.target.querySelector('[type=submit]');submit.disabled=true;
  library.preferences.username=name;clearTimeout(saveTimer);
  try{await call('save',library);renderProfile();closeProfile();notify(`Welcome, ${name}.`);}
  catch(e){library.preferences.username=previous;error.textContent=e.message;submit.disabled=false;}
});
document.addEventListener('keydown',event=>{
  const form=document.querySelector('#profile-form');if(!form||document.querySelector('#modal').classList.contains('hidden'))return;
  if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();closeProfile();}
  if(event.key==='Tab'){const controls=[...form.querySelectorAll('input,button')].filter(el=>!el.disabled);const first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
});
