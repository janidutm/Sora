(function(root){
  function normalizedTitle(s){return String(s||'').toLowerCase().normalize('NFKD').replace(/\((?:uncensored|dub|sub)\)/g,'').replace(/[^a-z0-9]/g,'');}
  function sourceQuery(media){return media.id===210482?'steel ball run':media.title?.english||media.title?.romaji||media.name;}
  function matchingSource(media,sources){if(media.id===210482){const verified=sources.find(s=>s.id==='steel-ball-run-jojo-s-bizarre-adventure-2nd-stage-10465');if(verified)return verified;}const names=[media.title?.english,media.title?.romaji,...(media.synonyms||[])].filter(Boolean).map(normalizedTitle);const exact=sources.filter(s=>names.includes(normalizedTitle(s.title)));return exact.length===1?exact[0]:null;}
  const api={normalizedTitle,matchingSource,sourceQuery};if(typeof module!=='undefined')module.exports=api;else Object.assign(root,api);
})(globalThis);
