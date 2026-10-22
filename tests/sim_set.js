// feed a real chime recording (optionally mixed with machine noise); report tiles, recognised card, screen readings
const {JSDOM}=require('jsdom'); const fs=require('fs'); const errs=[];
const [,,file,recf,noisef,ngain,cfg]=process.argv;
const dom=new JSDOM(fs.readFileSync(file,'utf8'),{url:'https://example.test/',runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(t,k)=>k==='measureText'?()=>({width:10}):()=>{},set:()=>true}); w.addEventListener('error',e=>errs.push(e.message)); w.navigator.vibrate=()=>true;}});
const w=dom.window,d=w.document; const sr=48000;
const rd=f=>{const b=fs.readFileSync(f); return new Float32Array(b.buffer.slice(b.byteOffset,b.byteOffset+b.length));};
setTimeout(()=>{try{
  d.getElementById('tabTuner').click();
  const T=w.__t,S=T.S; S.chimes=[]; S.pat='auto'; Object.assign(S,JSON.parse(cfg||'{}'));
  let sig=rd(recf).slice();
  if(noisef&&noisef!=='-'){ const nz=rd(noisef), g=+ngain, off=15*sr; for(let i=0;i<sig.length;i++) sig[i]+=g*nz[(off+i)%nz.length]; }
  let now=0,cur=0; w.performance.now=()=>now;
  const fill=(a,e)=>{for(let i=0;i<a.length;i++){const j=e-a.length+i; a[i]=j>=0&&j<sig.length?sig[j]:0;}};
  T.tun.an={getFloatTimeDomainData:a=>fill(a,cur)}; T.tun.an2={getFloatTimeDomainData:a=>fill(a,cur)};
  T.tun.buf=new Float32Array(8192); T.tun.buf2=new Float32Array(16384); T.setCtx({sampleRate:sr,state:'running'});
  const step=file.includes('old')?70:45; let prev='', shows=[], lastN=0, saves=[];
  for(let t=0.05;t<sig.length/sr;t+=step/1000){ cur=Math.round(t*sr); now=t*1000; T.analyse();
    const hz=d.getElementById('tHz').textContent; if(hz!==prev){ shows.push(t.toFixed(1)+':'+d.getElementById('tnName').textContent.trim()+' '+d.getElementById('tDev').textContent.trim()); prev=hz; }
    const n=S.chimes.reduce((a,c)=>a+(c.grp?c.grp.length:c.caps.length),0); if(n!==lastN){ saves.push(t.toFixed(1)+'('+S.chimes.map(c=>c.f.toFixed(1)).join('/')+')'); lastN=n; } }
  const tiles=[...d.querySelectorAll('#cgrid .ctile')].map(x=>{const b=x.querySelector('b'),s=x.querySelector('strong'); return (b?b.textContent:'?')+(s?' '+s.textContent:' –')+(x.classList.contains('locked')?' 🔒':'')+(x.classList.contains('exp')?' (expected)':'');});
  console.log('  tiles:',tiles.join(' | '));
  console.log('  card :',d.getElementById('patInfo')?d.getElementById('patInfo').textContent:'', '·', d.getElementById('chimeCount').textContent);
  console.log('  saves at:',saves.join(' ')); console.log('  values:',S.chimes.map(c=>c.f.toFixed(2)+' grp['+(c.grp||[]).map(v=>v.toFixed(2)).join(',')+'] caps['+c.caps.map(v=>v.toFixed(2)).join(',')+']').join('  '));
  if(process.env.SHOW) console.log('  screen:',shows.join('  '));
}catch(e){errs.push('TEST '+e.stack)} if(errs.length) console.log('errors:',errs.slice(0,3)); process.exit(0);},300);
