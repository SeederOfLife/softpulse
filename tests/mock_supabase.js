// minimal stand-in for Supabase REST (PostgREST) for the wayunki_log table
const http=require('http'); const rows=new Map(); let tick=0, down=false; const log=[];
const srv=http.createServer((req,res)=>{
  if(down){ req.destroy(); return; }
  const u=new URL(req.url,'http://x'); log.push(req.method+' '+u.pathname+u.search+' key='+(req.headers.apikey||'none')+(req.headers.authorization?' +auth':''));
  if(!req.headers.apikey){ res.writeHead(401); res.end(); return; }
  if(u.pathname!=='/rest/v1/wayunki_log'){ res.writeHead(404); res.end(); return; }
  if(req.method==='POST'){ let b=''; req.on('data',c=>b+=c); req.on('end',()=>{ JSON.parse(b).forEach(r=>{ if(req.headers.prefer&&!/merge-duplicates/.test(req.headers.prefer)&&rows.has(r.id)){ } rows.set(r.id,Object.assign({},r,{at:new Date(Date.UTC(2026,0,1)+(++tick)*1000).toISOString()})); }); res.writeHead(201); res.end(); }); return; }
  if(req.method==='GET'){ let out=[...rows.values()]; const at=u.searchParams.get('at'); if(at&&at.startsWith('gt.')) out=out.filter(r=>r.at>at.slice(3)); out.sort((a,b)=>a.at<b.at?-1:1);
    res.writeHead(200,{'content-type':'application/json'}); res.end(JSON.stringify(out.map(r=>({id:r.id,data:r.data,at:r.at})))); return; }
  res.writeHead(405); res.end();
});
module.exports={srv,rows,log,setDown:v=>{down=v;}};
