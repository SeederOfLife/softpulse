const {JSDOM}=require('jsdom'); const fs=require('fs'); const M=require('./mock_supabase.js');
const sr=48000; const rd=f=>{const b=fs.readFileSync(f); return new Float32Array(b.buffer.slice(b.byteOffset,b.byteOffset+b.length));};
function phone(name){ return new Promise(ok=>{ const errs=[];
  const dom=new JSDOM(fs.readFileSync('sim_sync.html','utf8'),{url:'https://phone-'+name+'.test/',runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(t,k)=>k==='measureText'?()=>({width:10}):()=>{},set:()=>true}); w.addEventListener('error',e=>errs.push(e.message)); w.navigator.vibrate=()=>true; w.confirm=()=>true; w.fetch=(u,o)=>fetch(u,o);}});
  setTimeout(()=>{ const w=dom.window; w.document.getElementById('tabTuner').click(); ok({w,T:w.__t,d:w.document,errs}); },300); }); }
function play(P,file){ const {w,T}=P; const sig=rd(file); let cur=0, clock=0; w.performance.now=()=>clock; const fill=(a,e)=>{for(let i=0;i<a.length;i++){const j=e-a.length+i; a[i]=j>=0&&j<sig.length?sig[j]:0;}};
  T.tun.an={getFloatTimeDomainData:a=>fill(a,cur)}; T.tun.an2={getFloatTimeDomainData:a=>fill(a,cur)}; T.tun.buf=new Float32Array(8192); T.tun.buf2=new Float32Array(16384); T.setCtx({sampleRate:sr,state:'running'});
  for(let t=0.05;t<sig.length/sr;t+=0.045){ cur=Math.round(t*sr); clock+=45; T.analyse(); } }
const sum=P=>P.T.logLive().map(e=>(e.device||'?')+':'+(e.card||'free')+'/'+e.tubes.length+'t/'+e.rings.length+'r').join(', ')||'(empty)';
(async()=>{ await new Promise(r=>M.srv.listen(8790,'127.0.0.1',r));
  const A=await phone('A'), B=await phone('B');
  A.T.S.chimes=[]; A.T.S.pat='auto'; A.d.getElementById('logDev').value='workshop A'; A.d.getElementById('logDev').dispatchEvent(new A.w.Event('change'));
  play(A,'/tmp/apkb/rec/chimes/Gmaj.f32');
  console.log('A queue before Reset:',A.T.sbQ().length); A.d.getElementById('chReset').click(); console.log('A queue after Reset:',A.T.sbQ().length);
  await A.T.sbSync(); console.log('A after sync: queue',A.T.sbQ().length,'| server rows',M.rows.size,'| status:',A.d.getElementById('logSyncTxt').textContent);
  await B.T.sbSync(); console.log('B sees:',sum(B));
  B.T.renderLog(); const del=B.d.querySelector('#logList [data-logdel]'); del.click(); await B.T.sbSync();
  await A.T.sbSync(); console.log('after B removed it → A sees:',sum(A),'| server row deleted flag:',[...M.rows.values()][0].deleted);
  // offline: A tunes F# minor without a connection
  M.setDown(true); A.d.getElementById('chReset').click(); play(A,'/tmp/apkb/rec/chimes/F_minor.f32'); A.d.getElementById('chReset').click(); await A.T.sbSync();
  A.T.renderLog(); console.log('offline → A status:',A.d.getElementById('logSyncTxt').textContent,'| queue',A.T.sbQ().length,'| server rows',M.rows.size);
  M.setDown(false); await A.T.sbSync(); await B.T.sbSync(); console.log('back online → server rows',M.rows.size,'| B sees:',sum(B),'| A status:',A.d.getElementById('logSyncTxt').textContent);
  console.log('requests sample:',M.log.slice(0,3).join(' || '));
  console.log('errors:',[...A.errs,...B.errs].length?[...A.errs,...B.errs].slice(0,3):'none');
  M.srv.close(); process.exit(0); })().catch(e=>{ console.log('TEST',e.stack); process.exit(1); });
