const {JSDOM}=require('jsdom'); const fs=require('fs'); const errs=[];
const [,,file,recf,stepArg,cfg]=process.argv;
const dom=new JSDOM(fs.readFileSync(file,'utf8'),{url:'https://example.test/',runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(t,k)=>k==='measureText'?()=>({width:10}):()=>{},set:()=>true}); w.addEventListener('error',e=>errs.push(e.message)); w.navigator.vibrate=()=>true;}});
const w=dom.window,d=w.document; const sr=48000;
setTimeout(()=>{try{
  d.getElementById('tabTuner').click();
  const T=w.__t, S=T.S; S.chimes=[];
  Object.assign(S,JSON.parse(cfg||'{}'));
  const rb=fs.readFileSync(recf); const sig=new Float32Array(rb.buffer.slice(rb.byteOffset,rb.byteOffset+rb.length));
  let now=0,cur=0; w.performance.now=()=>now;
  const fill=(a,e)=>{for(let i=0;i<a.length;i++){const j=e-a.length+i; a[i]=j>=0&&j<sig.length?sig[j]:0;}};
  T.tun.an={getFloatTimeDomainData:a=>fill(a,cur)}; T.tun.an2={getFloatTimeDomainData:a=>fill(a,cur)};
  T.tun.buf=new Float32Array(8192); T.tun.buf2=new Float32Array(16384); T.setCtx({sampleRate:sr,state:'running'});
  const stepMs=+(stepArg||45), dur=sig.length/sr;
  const g=id=>{const e=d.getElementById(id); return e?e.textContent.trim():'';};
  let prev='', changes=[], hear=0, frames=0, lastRec=0, recs=[];
  const sec={};
  for(let t=0.05;t<dur;t+=stepMs/1000){ cur=Math.round(t*sr); now=t*1000; T.analyse(); frames++;
    const st=g('tStatus'), shown=g('tnName')+' '+g('tDev')+' '+g('tHz');
    const h=st.startsWith('Hearing'); if(h) hear++;
    const s=Math.floor(t/10); sec[s]=sec[s]||{h:0,n:0}; sec[s].n++; if(h) sec[s].h++;
    const k=g('tHz'); if(k!==prev){ changes.push(t.toFixed(1)+'s '+shown.replace(/\s+/g,' ')); prev=k; }
    const n=S.chimes.reduce((a,c)=>a+c.caps.length,0); if(n>lastRec){ recs.push(t.toFixed(1)+'s '+S.chimes.map(c=>c.f.toFixed(1)).join('/')); lastRec=n; }
  }
  console.log('saved notes:',recs.join(' | ')||'NONE','· tiles:',S.chimes.length,'· rec text:',g('recTxt'));
  console.log('"Hearing it" '+(100*hear/frames).toFixed(0)+'% · per 10 s: '+Object.keys(sec).map(s=>(s*10)+'s:'+Math.round(100*sec[s].h/sec[s].n)+'%').join(' '));
  console.log('number updates: '+changes.length);
  if(process.env.SHOW) console.log(changes.join('\n'));
}catch(e){errs.push('TEST '+e.stack)} if(errs.length) console.log('errors:',errs.slice(0,3)); process.exit(0);},300);
