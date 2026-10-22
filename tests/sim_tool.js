const {JSDOM}=require('jsdom'); const fs=require('fs'); const errs=[];
const [,,file,ampArg,tauArg]=process.argv; const amp=+ampArg, tau=+(tauArg||0.18);
const dom=new JSDOM(fs.readFileSync(file,'utf8'),{url:'https://example.test/',runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(t,k)=>k==='measureText'?()=>({width:10}):()=>{},set:()=>true}); w.addEventListener('error',e=>errs.push(e.message)); w.navigator.vibrate=()=>true;}});
const w=dom.window,d=w.document; const sr=48000;
setTimeout(()=>{try{
  d.getElementById('tabTuner').click();
  const T=w.__t, S=T.S; S.pat='none'; S.chimes=[];
  const mf=m=>S.a4*Math.pow(2,(m-69)/12), cf=(f,c)=>f*Math.pow(2,c/1200);
  const rb=fs.readFileSync('/tmp/apkb/rec/rec.f32'); const raw=new Float32Array(rb.buffer.slice(rb.byteOffset,rb.byteOffset+rb.length));
  const tool=raw.subarray(Math.round(2.2*sr),Math.round(9.4*sr));
  const plan=[[67,0.3],[72,-0.8],[76,0.4],[79,1.2],[81,-0.3],[84,0.6],[69,-1.1],[74,0.9]];  // midi, cents
  const start=1.8, gap=1.6, dur=start+plan.length*gap+0.5, N=Math.round(dur*sr), sig=new Float32Array(N);
  for(let i=0;i<N;i++) sig[i]=tool[i%tool.length];
  let seed=9; const rnd=()=>{seed=(seed*16807)%2147483647; return seed/2147483647*2-1;};
  plan.forEach(([m,c],j)=>{ const f=cf(mf(m),c), s0=Math.round((start+j*gap)*sr);
    for(let i=0;i<Math.round(0.8*sr)&&s0+i<N;i++){ const u=i/sr; sig[s0+i]+=amp*Math.exp(-u/tau)*(Math.sin(2*Math.PI*f*u)+0.7*Math.sin(2*Math.PI*f*2.756*u+1)+0.3*Math.sin(2*Math.PI*f*5.404*u+2))+(i<300?amp*rnd():0); } });
  let now=0,cur=0; w.performance.now=()=>now;
  const fill=(a,e)=>{for(let i=0;i<a.length;i++){const j=e-a.length+i; a[i]=j>=0?sig[j]:0;}};
  T.tun.an={getFloatTimeDomainData:a=>fill(a,cur)}; T.tun.an2={getFloatTimeDomainData:a=>fill(a,cur)};
  T.tun.buf=new Float32Array(8192); T.tun.buf2=new Float32Array(16384); T.setCtx({sampleRate:sr,state:'running'});
  const stepMs=file.includes('old')?70:45;
  let rms=0; for(let i=0;i<sr;i++) rms+=sig[i]*sig[i]; if(process.env.DBG) console.log('noise rms',Math.sqrt(rms/sr).toFixed(4)); let seen=0; for(let t=0.05;t<dur;t+=stepMs/1000){ cur=Math.round(t*sr); now=t*1000; T.analyse(); if(process.env.DBG&&Math.abs(((t-start)%gap))<0.05&&t>start) console.log(t.toFixed(2),'last',T.tun.last&&T.tun.last.toFixed(1),'status',d.getElementById('tStatus').textContent); }
  const truth=plan.map(([m,c])=>({m,f:cf(mf(m),c)}));
  let hit=0, errsC=[], wrong=[];
  S.chimes.forEach(ch=>{ const m=Math.round(69+12*Math.log2(ch.f/S.a4)), tr=truth.find(x=>x.m===m);
    if(tr){ hit++; errsC.push(Math.abs(1200*Math.log2(ch.f/tr.f))); } else wrong.push(ch.f.toFixed(1)+'Hz'); });
  const mean=errsC.length?(errsC.reduce((a,b)=>a+b,0)/errsC.length):NaN, mx=errsC.length?Math.max(...errsC):NaN;
  console.log('  per tube:',truth.map(tr=>{const ch=S.chimes.find(c=>Math.round(69+12*Math.log2(c.f/S.a4))===tr.m); return (['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'][tr.m%12])+(Math.floor(tr.m/12)-1)+(ch?' '+(1200*Math.log2(ch.f/tr.f)).toFixed(2):' MISS');}).join(' | ')); console.log((file.includes('old')?'3.7 (now)':'NEW      ')+' chime amp '+amp+' ring τ '+tau+'s → caught '+hit+'/8 tubes · error mean '+mean.toFixed(2)+' ¢ max '+mx.toFixed(2)+' ¢ · false notes: '+(wrong.length?wrong.join(' '):'none'));
}catch(e){errs.push('TEST '+e.stack)} if(errs.length) console.log('errors:',errs); process.exit(0);},300);
