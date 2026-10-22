const {JSDOM}=require('jsdom'); const fs=require('fs'); const errs=[];
const [,,file,recf]=process.argv;
const dom=new JSDOM(fs.readFileSync(file,'utf8'),{url:'https://example.test/',runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(t,k)=>k==='measureText'?()=>({width:10}):()=>{},set:()=>true}); w.addEventListener('error',e=>errs.push(e.message)); w.navigator.vibrate=()=>true;}});
const w=dom.window,d=w.document; const sr=48000;
setTimeout(()=>{try{
  d.getElementById('tabTuner').click();
  const T=w.__t, S=T.S; S.pat='none'; S.chimes=[];
  const rb=fs.readFileSync(recf); const sig=new Float32Array(rb.buffer.slice(rb.byteOffset,rb.byteOffset+rb.length));
  let now=0,cur=0; w.performance.now=()=>now;
  const fill=(a,e)=>{for(let i=0;i<a.length;i++){const j=e-a.length+i; a[i]=j>=0&&j<sig.length?sig[j]:0;}};
  T.tun.an={getFloatTimeDomainData:a=>fill(a,cur)}; T.tun.an2={getFloatTimeDomainData:a=>fill(a,cur)};
  T.tun.buf=new Float32Array(8192); T.tun.buf2=new Float32Array(16384); T.setCtx({sampleRate:sr,state:'running'});
  const stepMs=file.includes('old')?70:45, dur=sig.length/sr;
  const log=[]; let lastRec=0, shownChanges=0, prevShown='', hearing=0, frames=0;
  for(let t=0.05;t<dur;t+=stepMs/1000){ cur=Math.round(t*sr); now=t*1000; T.analyse(); frames++;
    const sh=d.getElementById('tHz').textContent; if(sh!==prevShown){ shownChanges++; prevShown=sh; }
    if(d.getElementById('tStatus').textContent.startsWith('Hearing')) hearing++;
    const n=S.chimes.reduce((a,c)=>a+c.caps.length,0); if(n>lastRec){ const c=S.chimes.slice().sort((a,b)=>b.caps.length-a.caps.length)[0]; log.push(t.toFixed(1)+'s→'+S.chimes.map(c=>c.caps[0].toFixed(1)).join('/')); lastRec=n; }
  }
  const phase=(a,b)=>{};
  console.log((file.includes('old')?'3.7 now':'NEW    ')+': rings recorded at: '+(log.join('  ')||'none'));
  console.log('        tiles: '+S.chimes.map(c=>c.f.toFixed(2)+'Hz×'+c.caps.length+' ['+c.caps.map(v=>v.toFixed(1)).join(',')+']').join('  ')||'none');
  console.log('        "Hearing it" in '+(100*hearing/frames).toFixed(0)+'% of the time · display changed '+shownChanges+' times');
}catch(e){errs.push('TEST '+e.stack)} if(errs.length) console.log('errors:',errs); process.exit(0);},300);
