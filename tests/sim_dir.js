const {JSDOM}=require('jsdom'); const fs=require('fs'); const errs=[];
const dom=new JSDOM(fs.readFileSync('sim_new.html','utf8'),{url:'https://example.test/',runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(t,k)=>k==='measureText'?()=>({width:10}):()=>{},set:()=>true}); w.addEventListener('error',e=>errs.push(e.message)); w.navigator.vibrate=()=>true;}});
const w=dom.window,d=w.document;
setTimeout(()=>{try{
  d.getElementById('tabTuner').click(); const T=w.__t,S=T.S; S.pat='none';
  console.log('defaults: octOff',S.octOff,'lockTol',S.lockTol);
  const mf=m=>S.a4*Math.pow(2,(m-69)/12), cf=(f,c)=>f*Math.pow(2,c/1200);
  for(const up of [0.96,0.46,1.30]){
    S.chimes=[{f:cf(mf(69),0.46),caps:[1],grp:[1,1,1]},{f:cf(mf(81),up),caps:[1],grp:[1,1,1]}]; S.chimes.forEach(c=>{c.grp=[c.f,c.f,c.f];});
    d.getElementById('chReset'); T.renderChimes();
    const tiles=[...d.querySelectorAll('#cgrid .ctile')].filter(x=>x.querySelector('strong')).map(x=>x.querySelector('b').textContent+' '+x.querySelector('strong').textContent+' ['+x.querySelector('em').textContent+']'+(x.classList.contains('locked')?' 🔒':''));
    // live reading of the upper note
    T.tun.flowV=null; T.showReading(S.chimes[1].f,true,false,true);
    console.log('A5 at '+up+': tiles',tiles.join(' | '));
    console.log('   big number', d.getElementById('tnName').textContent+d.getElementById('tnOct').textContent, d.getElementById('tDev').textContent,'·',d.getElementById('tDir').textContent,'· popup:',d.getElementById('pLow').textContent,'|',d.getElementById('pGap').textContent,d.getElementById('pGapLab').textContent,'|',d.getElementById('pUp').textContent, d.getElementById('lockPill').hidden?'':'LOCKED');
  }
}catch(e){errs.push('TEST '+e.stack)} console.log('errors:',errs.length?errs:'none'); process.exit(0);},300);
