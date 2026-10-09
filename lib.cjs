const path = require('node:path');
function cleanError(text) { return String(text).replace(/\x1b\[[0-9;]*[A-Za-z]/g, '').replace(/\r/g, '').trim(); }
function parseRows(text) { return text.trim().split(/\r?\n/).filter(Boolean).map(line => {const [id,...rest]=line.split('\t'); return {id,title:rest.join('\t')};}); }
function safeFilename(title) { return String(title).replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').replace(/[. ]+$/g,'').slice(0,150) || 'episode'; }
function selectEpisodeRange(episodes, start, end) {
  const a=episodes.findIndex(e=>e.number===String(start)); const b=episodes.findIndex(e=>e.number===String(end));
  if(a<0||b<a) throw Error('Choose an available episode range in order.');
  if(b-a>=50) throw Error('Queue up to 50 episodes at a time.');
  return episodes.slice(a,b+1);
}
function validateProviderId(id) { if(typeof id!=='string'||!/^[a-zA-Z0-9-]{1,180}$/.test(id)) throw Error('Invalid anime source.'); return id; }
function validateEpisode(ep) { if(!/^\d+(?:\.\d+)?$/.test(String(ep))) throw Error('Invalid episode.');return String(ep); }
function progressFromLine(line) { const m=line.match(/\[download\]\s+([\d.]+)%/); return m?Number(m[1]):null; }
function waitForDrain(response) { return new Promise(resolve=>{function done(){response.off('drain',done);response.off('close',done);resolve();}response.once('drain',done);response.once('close',done);}); }
module.exports={cleanError,parseRows,safeFilename,selectEpisodeRange,validateProviderId,validateEpisode,progressFromLine,waitForDrain};
