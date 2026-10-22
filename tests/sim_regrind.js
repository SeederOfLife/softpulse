const {JSDOM}=require('jsdom'); const fs=require('fs'); const errs=[];
const dom=new JSDOM(fs.readFileSync(process.argv[2]||'sim_new.html','utf8'),{url:'https://example.test/',runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(t,k)=>k==='measureText'?()=>({width:10}):()=>{},set:()=>true}); w.addEventListener('error',e=>errs.push(e.message)); w.navigator.vibrate=()=>true;}});
const w=dom.window,d=w.document; const sr=48000;
setTimeout(()=>{try{
  d.getElementById('tabTuner').click();
  const T=w.__t, S=T.S; const mf=m=>S.a4*Math.pow(2,(m-69)/12), cf=(f,c)=>f*Math.pow(2,c/1200);
  const G4=cf(mf(67),0.3), C5=cf(mf(72),-0.2), E5=cf(mf(76),0.4), A5=cf(mf(81),-0.3), G5=cf(2*G4,-0.5);
  const C6old=cf(2*C5,0.5);               // gap +0.5 ¢ → 1 ¢ off target, not locked
  S.chimes=[G4,C5,E5,G5,A5,C6old].map(f=>({f:f,caps:[f],grp:[f,f,f]}));
  const others=[G4,C5,E5,G5,A5];
  const strikes=[[0.3,cf(2*C5,0.5)],[2.6,cf(2*C5,0.5)],[4.9,cf(2*C5,0.5)],[7.2,cf(2*C5,-0.5)],[9.5,cf(2*C5,-0.5)]];
  const dur=11.8, N=Math.round(dur*sr), sig=new Float32Array(N); let seed=5; const rnd=()=>{seed=(seed*16807)%2147483647; return seed/2147483647*2-1;};
  for(let i=0;i<N;i++){ const t=i/sr; let v=0.008*rnd();
    for(let k=0;k<strikes.length;k++){ const [s0,f]=strikes[k]; if(t<s0) continue; const nx=strikes[k+1]; if(nx&&t>=nx[0]) continue; const u=t-s0;
      v+=0.3*Math.exp(-u/2.5)*(Math.sin(2*Math.PI*f*u)+0.8*Math.sin(2*Math.PI*f*2.76*u)); if(u<0.01) v+=rnd();
      others.forEach((g,j)=>{ v+=0.03*Math.exp(-u/3)*Math.sin(2*Math.PI*g*u+j); });   // sympathetic ringing of the other tubes
    }
    sig[i]=v; }
  let now=0,cur=0; w.performance.now=()=>now;
  const fill=(a,e)=>{for(let i=0;i<a.length;i++){const j=e-a.length+i; a[i]=j>=0?sig[j]:0;}};
  T.tun.an={getFloatTimeDomainData:a=>fill(a,cur)}; T.tun.an2={getFloatTimeDomainData:a=>fill(a,cur)};
  T.tun.buf=new Float32Array(8192); T.tun.buf2=new Float32Array(16384); T.setCtx({sampleRate:sr,state:'running'});
  const c6=()=>S.chimes.find(c=>Math.round(69+12*Math.log2(c.f/S.a4))===84);
  const tileTxt=()=>{const t=[...d.querySelectorAll('#cgrid .ctile')].find(x=>x.querySelector('b').textContent==='C6'); return t?t.querySelector('strong').textContent+(t.classList.contains('locked')?' LOCKED':''):'-';};
  for(let t=0.07;t<dur;t+=0.07){ cur=Math.round(t*sr); now=t*1000; T.analyse();
    for(const s0 of [2.5,4.8,7.1,9.4,11.7]) if(Math.abs(t-s0)<0.035) console.log((s0===7.1?'after 3 rings BEFORE grinding':s0===11.7?'after 2nd ring AFTER grinding':'after ring')+' @'+t.toFixed(1)+'s → C6 tile '+tileTxt()+' | gap '+(1200*Math.log2(c6().f/(2*C5))).toFixed(2)+' ¢ | rings '+c6().grp.length+' | status: '+d.getElementById('tStatus').textContent);
  }
}catch(e){errs.push('TEST '+e.stack)} console.log('errors:',errs.length?errs:'none'); process.exit(0);},300);
