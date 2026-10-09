(function(root){
  function qualityIndex(levels,choice='best'){
    if(choice==='auto')return -1;if(!levels.length)return -1;
    const ranked=levels.map((l,i)=>({i,height:Number(l.height)||0,bitrate:Number(l.bitrate)||0})).sort((a,b)=>a.height-b.height||a.bitrate-b.bitrate);
    if(choice==='worst')return ranked[0].i;
    return ranked.filter(l=>l.height===Number(choice)).at(-1)?.i??ranked.at(-1).i;
  }
  const api={qualityIndex};if(typeof module==='object'&&module.exports)module.exports=api;else Object.assign(root,api);
})(typeof window!=='undefined'?window:globalThis);
