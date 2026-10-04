/* ============================================
   SriGen — MAIN ENGINE v6 (Multi-Backend)
   Har backend apni file mein (js/backends/*.js)
   Auto-chain: ek fail = agla automatic
   ============================================ */
(function(){
  'use strict';
  const $ = id => document.getElementById(id);
  const input=$('genPrompt'), btn=$('genBtn'), selSize=$('genSize'),
        selModel=$('genModel'), selBackend=$('genBackend'),
        status=$('genStatus'), wrap=$('genResult'), img=$('genImg'),
        dl=$('genDownload'), again=$('genAgain'), styleChips=$('genStyles'),
        keysBox=$('genKeys');

  let selectedStyle='realistic', loading=false, cancelFlag=false, lastBlob=null, lastObjUrl=null;

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

  const ORDER=['gemini','cloudflare','pollinations','sd-turbo','iagratis','perchance','pixqo','mevolab','hornofplenty'];
  const enabled=ORDER.filter(id=>GUPT.backends[id]&&GUPT.backends[id].enabled);

  selBackend.innerHTML='';
  const autoOpt=document.createElement('option');
  autoOpt.value='auto';
  autoOpt.textContent='🤖 Auto — sab backends try kare (recommended)';
  selBackend.appendChild(autoOpt);
  enabled.forEach(id=>{
    const b=GUPT.backends[id];
    const o=document.createElement('option');
    o.value=id; o.textContent=b.emoji+' '+b.name;
    selBackend.appendChild(o);
  });

  keysBox.innerHTML='';
  const seen={};
  enabled.forEach(id=>{
    (GUPT.backends[id].fields||[]).forEach(f=>{
      if(seen[f.storage]) return; seen[f.storage]=1;
      const inp=document.createElement('input');
      inp.type='text'; inp.className='gen-input';
      inp.placeholder=f.label; inp.maxLength=200;
      inp.value=localStorage.getItem(f.storage)||'';
      inp.style.cssText='margin-top:10px;font-size:.85rem';
      inp.addEventListener('change',()=>{
        localStorage.setItem(f.storage,inp.value.trim());
        setS('🔑 Key save ho gayi!');
      });
      keysBox.appendChild(inp);
    });
  });

  function setS(m){ if(status) status.textContent=m; }
  function aspectHint(){
    const v=selSize.value;
    if(v==='1280x720') return '16:9 widescreen aspect ratio';
    if(v==='720x1280') return '9:16 vertical portrait aspect ratio';
    return '1:1 square aspect ratio';
  }

  async function requestImage(prompt){
    loading=true; cancelFlag=false;
    const mode=selBackend.value;
    const list = mode==='auto' ? enabled : [mode];
    let blob=null, usedBackend='';

    for(const id of list){
      if(cancelFlag) break;
      const b=GUPT.backends[id];
      if(!b||!b.enabled) continue;
      const missing=(b.fields||[]).filter(f=>!localStorage.getItem(f.storage));
      if(missing.length){
        setS('🔑 '+b.name+': key chahiye (neeche box mein daalo) — agla backend…');
        continue;
      }
      try{
        setS(b.emoji+' '+b.name+': ban raha hai…');
        blob=await b.generate(prompt, STYLES[selectedStyle].boost, aspectHint(),
          {size:selSize.value, model:selModel.value, cancelled:()=>cancelFlag});
        if(blob){ usedBackend=b.name; break; }
      }catch(e){
        console.warn(id, e);
        setS('⚠️ '+b.name+' fail — agla backend try…');
      }
    }

    loading=false;
    btn.disabled=false; btn.textContent='🎨 Generate';
    if(cancelFlag){ setS('🚫 Cancel ho gaya.'); return; }
    if(!blob){ setS('❌ Sab backends fail. Keys check karo ya 10 min baad try karo.'); return; }

    lastBlob=blob;
    if(lastObjUrl) URL.revokeObjectURL(lastObjUrl);
    lastObjUrl=URL.createObjectURL(blob);
    img.src=lastObjUrl;
    setS('✅ '+usedBackend+' ne banaya! Download karo ya 🔄 New Variation.');
    wrap.scrollIntoView({behavior:'smooth',block:'nearest'});
  }

  function generate(){
    if(loading){ cancelFlag=true; return; }
    const prompt=input.value.trim();
    if(!prompt){ setS('⚠️ Pehle likho kya banana hai'); return; }
    btn.disabled=true; btn.textContent='🚫 Cancel';
    wrap.classList.remove('hidden');
    requestImage(prompt);
  }

  btn.addEventListener('click', generate);
  input.addEventListener('keydown', e=>{ if(e.key==='Enter') generate(); });
  again.addEventListener('click', ()=>{ if(!loading) generate(); });
  dl.addEventListener('click', ()=>{
    if(!lastBlob) return;
    const a=document.createElement('a');
    a.href=URL.createObjectURL(lastBlob);
    a.download='srigen-'+Date.now()+'.jpg';
    document.body.appendChild(a); a.click(); a.remove();
  });
})();
