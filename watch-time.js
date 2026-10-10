(function(root){
 function watchedSeconds(previous,next){if(!previous||!next.playing||!previous.playing)return 0;const seconds=(next.wall-previous.wall)/1000,advance=next.position-previous.position;if(seconds<=0||seconds>2.5||advance<=0||Math.abs(advance-seconds*next.rate)>1)return 0;return seconds;}
 const api={watchedSeconds};if(typeof module==='object')module.exports=api;else root.watchedSeconds=watchedSeconds;
})(typeof window==='object'?window:globalThis);
