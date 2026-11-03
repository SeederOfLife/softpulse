const {JSDOM}=require('jsdom'); const fs=require('fs'); const errs=[];
const dom=new JSDOM(fs.readFileSync('sim_new.html','utf8'),{url:'https://example.test/',runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(t,k)=>k==='measureText'?()=>({width:10}):()=>{},set:()=>true}); w.addEventListener('error',e=>errs.push(e.message)); w.navigator.vibrate=()=>true; w.confirm=()=>true;}});
const w=dom.window,d=w.document; const sr=48000;
const rd=f=>{const b=fs.readFileSync(f); return new Float32Array(b.buffer.slice(b.byteOffset,b.byteOffset+b.length));};
setTimeout(()=>{try{ d.getElementById('tabTuner').click(); const T=w.__t,S=T.S; S.chimes=[]; S.pat='auto';
  let clock=0; w.performance.now=()=>clock;
  const play=(file)=>{ const sig=rd(file); let cur=0; const fill=(a,e)=>{for(let i=0;i<a.length;i++){const j=e-a.length+i; a[i]=j>=0&&j<sig.length?sig[j]:0;}};
    T.tun.an={getFloatTimeDomainData:a=>fill(a,cur)}; T.tun.an2={getFloatTimeDomainData:a=>fill(a,cur)}; T.tun.buf=new Float32Array(8192); T.tun.buf2=new Float32Array(16384); T.setCtx({sampleRate:sr,state:'running'});
    for(let t=0.05;t<sig.length/sr;t+=0.045){ cur=Math.round(t*sr); clock+=45; T.analyse(); } };
  const show=(when)=>{ T.renderLog(); console.log(when+': log '+T.logLive().length+' | upload queue '+T.sbQ().length+' | top card: '+(d.querySelector('#logList .logitem h3')||{textContent:'-'}).textContent); };
  play('/tmp/apkb/rec/chimes/Gmaj.f32'); show('after tuning G major (no reset)');
  d.getElementById('chSave').click(); show('after Save set');
  d.getElementById('chReset').click(); show('after Reset'); console.log('   message:',d.getElementById('setMsg').textContent);
  play('/tmp/apkb/rec/chimes/F_minor.f32'); show('after tuning F♯ minor (no reset)');
  // reload in the middle of tuning: the unsaved wayunki must survive
  const pend=w.localStorage.getItem('softpulse.log.pending'); console.log('pending kept on the phone:',!!pend,'tubes',pend?JSON.parse(pend).tubes.length:0);
  d.getElementById('chReset').click(); show('after second Reset');
  d.getElementById('chReset').click(); show('after Reset with nothing tuned');
}catch(e){errs.push('TEST '+e.stack)} console.log('errors:',errs.length?errs.slice(0,3):'none'); process.exit(0);},300);
