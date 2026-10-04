/* SriGen Backend: POLLINATIONS
   WORKING — free, token optional (pollinations.ai)
   ============================================ */
window.GUPT = window.GUPT || {};
GUPT.backends = GUPT.backends || {};

GUPT.backends.pollinations={
  id:'pollinations', name:'Pollinations', emoji:'🌸', enabled:true,
  fields:[{storage:'srigen_token', label:'🔑 Pollinations Token (optional — zyada limit)'}],
  async generate(prompt, styleBoost, hint, opts){
    const token=localStorage.getItem('srigen_token')||'';
    const model=(opts&&opts.model)||'flux';
    const parts=(opts&&opts.size)||'1024x1024';
    const sleep=ms=>new Promise(r=>setTimeout(r,ms));
    for(let attempt=1;attempt<=3;attempt++){
      if(opts&&opts.cancelled&&opts.cancelled()) return null;
      const seed=Math.floor(Math.random()*999999);
      const full=prompt+'. Scene: '+prompt+', '+styleBoost+', high quality, detailed';
      const url='https://image.pollinations.ai/prompt/'+encodeURIComponent(full)
        +'?width='+parts.split('x')[0]+'&height='+parts.split('x')[1]
        +'&seed='+seed+'&model='+model
        +(model==='flux'?'&enhance=true':'')
        +(token?'&token='+encodeURIComponent(token):'')
        +'&nologo=true&referrer=srigen';
      try{
        const ctrl=new AbortController();
        const to=setTimeout(()=>ctrl.abort(),50000);
        const resp=await fetch(url,{signal:ctrl.signal});
        clearTimeout(to);
        if(!resp.ok){ await sleep(12000); continue; }
        const blob=await resp.blob();
        if(blob.size<3000){ await sleep(12000); continue; }
        return blob;
      }catch(e){ await sleep(12000); }
    }
    throw new Error('Pollinations 3 baar fail');
  }
};
