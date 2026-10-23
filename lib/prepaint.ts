// Inline <head> script that runs before first paint (kept tiny and dependency-free).
// localStorage 'duru-style-v2' {skin, acc} is the source of truth; the 'duru-skin' cookie only mirrors it
// so the server (middleware) can serve the right skin tree.
//  1. No stored choice yet → store the skin the server picked (random on a first visit).
//  2. Stored skin ≠ rendered skin (cookie lost) → fix the cookie and reload hidden, once per session.
//  3. Set data-acc (skins with several accents) so there is no accent flash.
//  4. Arriving from a skin switch → show this skin's curtain at first paint, then fade it out (400 ms).
// The skin list, legacy names and accent counts come from the registry (lib/skins.ts).
import { ACCENT_COUNT, LEGACY_SKINS, SKIN_COOKIE, SKINS, STORAGE_KEY, SWITCH_FLAG } from './skins'

const source = `(function(){
var d=document.documentElement,k=${JSON.stringify(STORAGE_KEY)},sk=d.getAttribute('data-skin'),s=null,
all=${JSON.stringify(SKINS)},legacy=${JSON.stringify(LEGACY_SKINS)},accs=${JSON.stringify(ACCENT_COUNT)},
ok=function(v){return all.indexOf(v)>-1};
try{s=JSON.parse(localStorage.getItem(k)||'null')}catch(e){}
if(s&&legacy[s.skin])s.skin=legacy[s.skin];
var save=function(v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
var ck=function(v){document.cookie=${JSON.stringify(SKIN_COOKIE)}+'='+v+';path=/;max-age=31536000;samesite=lax'};
if(!s||!ok(s.skin)){s={skin:sk,acc:0};save(s)}
else if(s.skin!==sk){
  var once=null;try{once=sessionStorage.getItem('duru-skin-sync')}catch(e){}
  if(once!==s.skin){try{sessionStorage.setItem('duru-skin-sync',s.skin)}catch(e){}ck(s.skin);d.style.visibility='hidden';location.reload();return}
  s={skin:sk,acc:0};save(s)
}
try{sessionStorage.removeItem('duru-skin-sync')}catch(e){}
ck(sk);
var a=Math.max(0,Math.min((accs[sk]||1)-1,parseInt(s.acc,10)||0));d.setAttribute('data-acc',String(a));
var sw=null;try{sw=sessionStorage.getItem(${JSON.stringify(SWITCH_FLAG)});sessionStorage.removeItem(${JSON.stringify(SWITCH_FLAG)})}catch(e){}
if(sw){d.setAttribute('data-switching','in');
  var out=function(){requestAnimationFrame(function(){d.setAttribute('data-switching','out');setTimeout(function(){d.removeAttribute('data-switching')},450)})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',out);else out();
}
})();`

export const PREPAINT_SCRIPT = source.replace(/\n\s*/g, '')
