(function(root){
  function normalizedTitle(s){return String(s||'').toLowerCase().normalize('NFKD').replace(/\((?:uncensored|dub|sub)\)/g,'').replace(/[^a-z0-9]/g,'');}
  function sourceQuery(media){return media.id===210482?'steel ball run':media.title?.english||media.title?.romaji||media.name;}
  function matchingSource(media,sources){if(media.id===210482){const verified=sources.find(s=>s.id==='steel-ball-run-jojo-s-bizarre-adventure-2nd-stage-10465');if(verified)return verified;}const names=[media.title?.english,media.title?.romaji,...(media.synonyms||[])].filter(Boolean).map(normalizedTitle);const exact=sources.filter(s=>names.includes(normalizedTitle(s.title)));return exact.length===1?exact[0]:null;}
  function rankSources(media,sources){
    const exact=matchingSource(media,sources);if(exact)return [{source:exact,score:1}];
    const names=[media.title?.english,media.title?.romaji,...(media.synonyms||[])].filter(s=>typeof s==='string'&&s.length>7);
    const words=s=>String(s).toLowerCase().normalize('NFKD').replace(/\((?:uncensored|dub|sub)\)/g,'').replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w&&!['the','a','of','no','na','part','season'].includes(w));
    const score=(a,b)=>{const aw=words(a),bw=words(b);const an=aw.filter(w=>/^\d+$/.test(w)),bn=bw.filter(w=>/^\d+$/.test(w));if(an.length&&bn.length&&!an.every(n=>bn.includes(n)))return 0;if(!an.length&&bn.length)return 0;const common=aw.filter(w=>bw.includes(w)).length;return 2*common/(aw.length+bw.length);};
    return sources.map(source=>({source,score:Math.max(0,...names.map(n=>score(n,source.title)))})).filter(s=>s.score>=0.78).sort((a,b)=>b.score-a.score||Number(a.source.title.includes('Uncensored'))-Number(b.source.title.includes('Uncensored')));
  }
  const api={normalizedTitle,matchingSource,sourceQuery,rankSources};if(typeof module!=='undefined')module.exports=api;else Object.assign(root,api);
})(globalThis);
