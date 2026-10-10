(function(root){
  function username(value){
    if(typeof value!=='string')return '';
    const name=value.normalize('NFC').trim().replace(/\s+/gu,' ');
    return name&&Array.from(name).length<=32&&!/[\p{Cc}\p{Cf}]/u.test(name)?name:'';
  }
  function initial(value){const name=username(value);return name?Array.from(name)[0].toLocaleUpperCase():'?';}
  function picture(value){return typeof value==='string'&&value.length<=400000&&/^data:image\/png;base64,iVBORw0KGgo[A-Za-z0-9+/]*={0,2}$/.test(value)?value:'';}
  const api={username,initial,picture};
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.SoraProfile=api;
})(typeof globalThis!=='undefined'?globalThis:this);
