/* ============================================
   SriGen — AI IMAGE GENERATOR v3
   - Auto-retry (no cooldown, image khud aayegi)
   - Prompt reinforcement (exact scene follow)
   - Flux mode: LLM enhance ON
   ============================================ */
(function(){
  'use strict';
  const $ = id => document.getElementById(id);
  const input=$('genPrompt'), btn=$('genBtn'), selSize=$('genSize'), selModel=$('genModel'),
        status=$('genStatus'), wrap=$('genResult'), img=$('genImg'),
        dl=$('genDownload'), again=$('genAgain'), styleChips=$('genStyles');

  let currentURL=null, currentSeed=0, selectedStyle='realistic';
  let retryCount=0, retryTimer=null, loading=false;

  const STYLES={
    realistic:  {label:'🎯 Realistic',  boost:'ultra realistic photograph, sharp focus, dslr quality'},
    anime:      {label:'🌸 Anime',      boost:'anime style, vibrant colors, detailed illustration'},
    digital:    {label:'🎨 Digital Art',boost:'digital art, concept art, dramatic lighting'},
    oilpaint:   {label:'🖼️ Oil Paint',  boost:'oil painting, textured brushstrokes, fine art'},
    render3d:   {label:'🧊 3D Render',  boost:'3d render, octane render, cinematic lighting'},
    photo:      {label:'📷 DSLR Photo', boost:'dslr photograph, 50mm lens, professional photo'},
    cyberpunk:  {label:'🌃 Cyberpunk',  boost:'cyberpunk, neon lights, futuristic, cinematic'},
    watercolor: {label:'💧 Watercolor', boost:'watercolor painting, soft colors, artistic'}
  };

  Object.keys(STYLES).forEach(key=>{
    const b=document.createElement('button');
    b.className='chip'+(key===selectedStyle?' active':'');
    b.textContent=STYLES[key].label;
    b.addEventListener('click',()=>{
      styleChips.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      selectedStyle=key;
    });
    styleChips.appendChild(b);
  });

  function setS(m){ if(status) status.textContent=m; }

  function generate(){
    // Loading ke dauran dabaya = Cancel
    if(loading){
      clearTimeout(retryTimer);
      loading=false;
      btn.disabled=false; btn.textContent='🎨 Generate';
      setS('🚫 Cancel ho gaya — jab ready ho tab Generate dabao');
      return;
    }
    const prompt=input.value.trim();
    if(!prompt){ setS('⚠️ Pehle likho kya banana hai'); return; }
    retryCount=0;
    requestImage(prompt);
  }

  function requestImage(prompt){
    loading=true;
    const parts=selSize.value.split('x');
    const model=selModel.value;
    currentSeed=Math.floor(Math.random()*999999);

    // PROMPT REINFORCEMENT: user prompt 2 baar (weight double) + chhota style boost
    const full=prompt + '. Scene: ' + prompt + ', ' + STYLES[selectedStyle].boost + ', high quality, detailed';

    currentURL='https://image.pollinations.ai/prompt/'+encodeURIComponent(full)
      +'?width='+parts[0]+'&height='+parts[1]
      +'&seed='+currentSeed+'&model='+model
      +(model==='flux'?'&enhance=true':'')
      +'&nologo=true&referrer=srigen';

    btn.disabled=true; btn.textContent='🚫 Cancel';
    wrap.classList.remove('hidden');
    setS(model==='flux' ? '🎨 Quality mode: ban rahi hai…' : '⚡ Fast mode: ban rahi hai…');

    let finished=false;
    // 60 sec mein na aaye = fail (timeout)
    const timeout=setTimeout(()=>{
      if(!finished){ finished=true; onFail(prompt); }
    },60000);

    img.onload=()=>{
      if(finished) return; finished=true; clearTimeout(timeout);
      loading=false; retryCount=0;
      btn.disabled=false; btn.textContent='🎨 Generate';
      setS('✅ Ready! Download karo ya 🔄 New Variation banao.');
      wrap.scrollIntoView({behavior:'smooth',block:'nearest'});
    };
    img.onerror=()=>{
      if(finished) return; finished=true; clearTimeout(timeout);
      onFail(prompt);
    };
    img.src=currentURL;
  }

  function onFail(prompt){
    retryCount++;
    if(retryCount>12){
      loading=false;
      btn.disabled=false; btn.textContent='🎨 Generate';
      setS('❌ Server bahut busy tha (4 min try kiya). 5 min baad dubara dabao.');
      return;
    }
    const wait=Math.min(30, 10+retryCount*2); // 12s,14s,16s... max 30s
    setS(`🔄 Server busy — auto-retry ${retryCount}/12 (khud ${wait} sec mein try hoga)… Cancel chahiye toh button dabao`);
    retryTimer=setTimeout(()=>{ if(loading) requestImage(prompt); }, wait*1000);
  }

  btn.addEventListener('click', generate);
  input.addEventListener('keydown', e=>{ if(e.key==='Enter') generate(); });
  again.addEventListener('click', ()=>{ if(!loading) generate(); });

  dl.addEventListener('click', async ()=>{
    if(!currentURL) return;
    try{
      const r=await fetch(currentURL);
      const b=await r.blob();
      const a=document.createElement('a');
      a.href=URL.createObjectURL(b);
      a.download=`srigen-${currentSeed}.jpg`;
      document.body.appendChild(a); a.click(); a.remove();
    }catch(e){ window.open(currentURL,'_blank'); }
  });
})();
