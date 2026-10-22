const {JSDOM}=require('jsdom'); const fs=require('fs'); const errs=[];
const [,,file,recf,cfg]=process.argv;
const dom=new JSDOM(fs.readFileSync(file,'utf8'),{url:'https://example.test/',runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(t,k)=>k==='measureText'?()=>({width:10}):()=>{},set:()=>true}); w.addEventListener('error',e=>errs.push(e.message)); w.navigator.vibrate=()=>true;}});
const w=dom.window,d=w.document; const sr=48000;
setTimeout(()=>{try{
  d.getElementById('tabTuner').click(); const T=w.__t,S=T.S; S.chimes=[]; S.pat='auto'; Object.assign(S,JSON.parse(cfg||'{}'));
  const b=fs.readFileSync(recf); const sig=new Float32Array(b.buffer.slice(b.byteOffset,b.byteOffset+b.length));
  let now=0,cur=0; w.performance.now=()=>now;
  const fill=(a,e)=>{for(let i=0;i<a.length;i++){const j=e-a.length+i; a[i]=j>=0&&j<sig.length?sig[j]:0;}};
  T.tun.an={getFloatTimeDomainData:a=>fill(a,cur)}; T.tun.an2={getFloatTimeDomainData:a=>fill(a,cur)};
  T.tun.buf=new Float32Array(8192); T.tun.buf2=new Float32Array(16384); T.setCtx({sampleRate:sr,state:'running'});
  let prev='';
  for(let t=0.05;t<sig.length/sr;t+=0.045){ cur=Math.round(t*sr); now=t*1000; T.analyse(); if(T.flowStep){ T.flowStep(now-22); T.flowStep(now); }
    const bx=d.getElementById('pairBox'); const st=bx.hidden?'(hidden)':(d.getElementById('pLow').textContent.replace(/\s+/g,' ')+' | gap '+d.getElementById('pGap').textContent+' | '+(bx.dataset.lock||'-')+(d.getElementById('lockPill').hidden?'':' LOCKED-PILL')+' | up '+d.getElementById('pUp').textContent.replace(/\s+/g,' '));
    const tile=[...d.querySelectorAll('#cgrid .ctile')].find(x=>x.querySelector('b')&&x.querySelector('b').textContent==='G5');
    const line=st+' || G5 tile '+(tile?(tile.querySelector('strong')||{}).textContent+(tile.classList.contains('locked')?' 🔒':''):'-');
    if(line!==prev){ console.log(t.toFixed(2),line); prev=line; } }
  console.log('G4/G5 saved:',S.chimes.filter(c=>Math.abs(c.f-392)<5||Math.abs(c.f-784)<10).map(c=>c.f.toFixed(2)+' caps['+c.caps.map(v=>v.toFixed(2))+']').join('  '), 'lockTol',S.lockTol,'octOff',S.octOff);
}catch(e){errs.push('TEST '+e.stack)} if(errs.length) console.log('errors:',errs.slice(0,3)); process.exit(0);},300);
