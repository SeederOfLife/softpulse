const {JSDOM}=require('jsdom'); const fs=require('fs'); const errs=[];
const dom=new JSDOM(fs.readFileSync('sim_new.html','utf8'),{url:'https://example.test/',runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(t,k)=>k==='measureText'?()=>({width:10}):()=>{},set:()=>true}); w.addEventListener('error',e=>errs.push(e.message)); w.navigator.vibrate=()=>true;}});
const w=dom.window,d=w.document; const sr=48000;
setTimeout(()=>{try{
  d.getElementById('tabTuner').click(); const T=w.__t,S=T.S; S.pat='none';
  for(const F of [528,272.2,250.56,440,114,392,1046.5]){
    S.inst='manual'; S.tMin=60; S.tMax=2000; S.chimes=[];
    const N=Math.round(2*sr), sig=new Float32Array(N); for(let i=0;i<N;i++){const t=i/sr; sig[i]=(t>0.3?0.3*Math.exp(-(t-0.3)/1.2)*Math.sin(2*Math.PI*F*t):0)+0.002*Math.sin(i*12.9898%6.28);}
    let now=1e5*(1+[528,272.2,250.56,440,114,392,1046.5].indexOf(F)),cur=0; w.performance.now=()=>now;
    const fill=(a,e)=>{for(let i=0;i<a.length;i++){const j=e-a.length+i; a[i]=j>=0&&j<sig.length?sig[j]:0;}};
    T.tun.an={getFloatTimeDomainData:a=>fill(a,cur)}; T.tun.an2={getFloatTimeDomainData:a=>fill(a,cur)};
    T.tun.buf=new Float32Array(8192); T.tun.buf2=new Float32Array(16384); T.setCtx({sampleRate:sr,state:'running'});
    for(let t=0.05;t<1.6;t+=0.045){ cur=Math.round(t*sr); now+=45; T.analyse(); }
    const m=d.getElementById('hzMatch');
    console.log(F+' Hz → shown '+d.getElementById('tHz').textContent+' | chip: '+(m.hidden?'(none)':m.textContent));
  }
  console.log('page rows:',d.querySelectorAll('#hzList .hzrow').length,'groups:',d.querySelectorAll('#hzList .hzgroup').length);
  console.log('hzNow:',d.getElementById('hzNow').textContent.slice(0,200));
}catch(e){errs.push('TEST '+e.stack)} console.log('errors:',errs.length?errs.slice(0,3):'none'); process.exit(0);},300);
