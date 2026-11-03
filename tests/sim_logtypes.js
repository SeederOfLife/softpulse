const {JSDOM}=require('jsdom'); const fs=require('fs'); const errs=[];
const dom=new JSDOM(fs.readFileSync('sim_new.html','utf8'),{url:'https://example.test/',runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(t,k)=>k==='measureText'?()=>({width:10}):()=>{},set:()=>true}); w.addEventListener('error',e=>errs.push(e.message)); w.navigator.vibrate=()=>true; w.confirm=()=>true;}});
const w=dom.window,d=w.document; const sr=48000;
const rd=f=>{const b=fs.readFileSync(f); return new Float32Array(b.buffer.slice(b.byteOffset,b.byteOffset+b.length));};
function fftMag(x){ const n=x.length, re=Float64Array.from(x), im=new Float64Array(n);
  for(let i=1,j=0;i<n;i++){ let bit=n>>1; for(;j&bit;bit>>=1) j^=bit; j^=bit; if(i<j){ [re[i],re[j]]=[re[j],re[i]]; } }
  for(let len=2;len<=n;len<<=1){ const ang=-2*Math.PI/len; for(let i=0;i<n;i+=len) for(let k=0;k<len/2;k++){ const c=Math.cos(ang*k), s=Math.sin(ang*k), a=i+k, b=a+len/2, tr=re[b]*c-im[b]*s, ti=re[b]*s+im[b]*c; re[b]=re[a]-tr; im[b]=im[a]-ti; re[a]+=tr; im[a]+=ti; } }
  return {re,im}; }
setTimeout(()=>{try{ d.getElementById('tabTuner').click(); const T=w.__t,S=T.S; S.chimes=[]; S.pat='auto';
  let clock=0; w.performance.now=()=>clock; let sig=null, cur=0;
  const fill=(a,e)=>{for(let i=0;i<a.length;i++){const j=e-a.length+i; a[i]=j>=0&&j<sig.length?sig[j]:0;}};
  T.tun.an={getFloatTimeDomainData:a=>fill(a,cur)}; T.tun.an2={getFloatTimeDomainData:a=>fill(a,cur)}; T.tun.buf=new Float32Array(8192); T.tun.buf2=new Float32Array(16384);
  T.tun.sp={fftSize:8192,frequencyBinCount:4096,getFloatFrequencyData:out=>{ const x=new Float64Array(8192); for(let i=0;i<8192;i++){ const j=cur-8192+i; x[i]=(j>=0&&j<sig.length?sig[j]:0)*(0.5-0.5*Math.cos(2*Math.PI*i/8191)); } const {re,im}=fftMag(x); for(let k=0;k<4096;k++) out[k]=10*Math.log10((re[k]*re[k]+im[k]*im[k])/8192/8192+1e-14); }};
  T.setCtx({sampleRate:sr,state:'running'});
  const run=(s,dur)=>{ sig=s; for(let t=0.05;t<(dur||s.length/sr);t+=0.045){ cur=Math.round(t*sr); clock+=45; T.analyse(); } };
  const whole=(freqs,seed)=>{ const N=5*sr, x=new Float32Array(N); let r=seed; const rnd=()=>{r=(r*16807)%2147483647; return r/2147483647-0.5;};
    for(let i=0;i<N;i++){ const t=i/sr; let v=0.002*rnd(); if(t>0.4){ const u=t-0.4; freqs.forEach((f,k)=>{ v+=0.05*Math.exp(-u/2.5)*(Math.sin(2*Math.PI*f*u+k)+0.25*Math.sin(2*Math.PI*f*2.756*u+k)); }); } x[i]=v; } return x; };
  const doSet=(file,check)=>{ run(rd(file)); if(check){ const fr=S.chimes.map(c=>c.f); T.tun.on=true; d.getElementById('chordBtn').click(); T.tun.on=false; run(whole(fr,3+fr.length),5); } d.getElementById('chReset').click(); };
  doSet('/tmp/apkb/rec/chimes/Gmaj.f32',true);
  doSet('/tmp/apkb/rec/chimes/Gmaj.f32',true);
  doSet('/tmp/apkb/rec/chimes/F_minor.f32',false);
  T.renderLog();
  console.log('log:',T.logLive().map(e=>(e.card)+(e.chord?' check '+e.chord.score+(e.chord.spec?' spec '+e.chord.spec.db.length:''):'')).join(' | '));
  console.log('card tiles:'); [...d.querySelectorAll('#logTypes .ltype')].forEach(b=>console.log('   ',b.textContent.replace(/\s+/g,' ')));
  d.querySelector('#logTypes [data-type="card:gmaj"]').click();
  console.log('card page:',d.getElementById('ldTitle').textContent,'| spectrum svg:',d.querySelectorAll('#ldBody .ldspec').length,'ghost curves:',d.querySelectorAll('#ldBody .ldspec .ghost').length,'| tube cards:',d.querySelectorAll('#ldBody .ldtube').length,'| wayunki rows:',d.querySelectorAll('#ldBody .ldrow').length);
  console.log('first tube:',d.querySelector('#ldBody .ldtube .ldtop').textContent,'|',d.querySelector('#ldBody .ldtube .ldfacts').textContent);
  d.querySelector('#ldBody .ldrow').click(); console.log('opened from card page:',d.getElementById('ldTitle').textContent,'| back button:',d.getElementById('ldBack').textContent,'| spectrum on wayunki page:',d.querySelectorAll('#ldBody .ldspec').length);
  d.getElementById('ldBack').click(); console.log('back →',d.getElementById('ldTitle').textContent); d.getElementById('ldBack').click(); console.log('back → overlay hidden:',d.getElementById('logDetail').hidden);
  fs.writeFileSync('/tmp/claude-0/-home-claude/abfd93d0-6377-5006-8a45-6aed155f0f44/scratchpad/seedlog.json',JSON.stringify(T.logLoad()));
}catch(e){errs.push('TEST '+e.stack)} console.log('errors:',errs.length?errs.slice(0,3):'none'); process.exit(0);},300);
