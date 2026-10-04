/* ============================================
   SriGen — AI IMAGE GENERATOR (standalone)
   Free cloud: Pollinations.ai (no API key)
   ============================================ */
(function(){
  'use strict';
  const $ = id => document.getElementById(id);
  const input=$('genPrompt'), btn=$('genBtn'), selSize=$('genSize'), selModel=$('genModel'),
        status=$('genStatus'), wrap=$('genResult'), img=$('genImg'),
        dl=$('genDownload'), again=$('genAgain'), styleChips=$('genStyles');

  let currentURL=null, currentSeed=0, selectedStyle='realistic';

  const STYLES={
    realistic:  {label:'🎯 Realistic',  boost:', ultra realistic photograph, 8k, professional photography, sharp focus, natural lighting'},
    anime:      {label:'🌸 Anime',      boost:', anime style, vibrant colors, studio ghibli inspired, detailed illustration'},
    digital:    {label:'🎨 Digital Art',boost:', digital art, concept art, trending on artstation, highly detailed, dramatic lighting'},
    oilpaint:   {label:'🖼️ Oil Paint',  boost:', classical oil painting, textured brushstrokes, canvas texture, fine art'},
    render3d:   {label:'🧊 3D Render',  boost:', 3d render, octane render, unreal engine 5, cinematic lighting, hyper detailed'},
    photo:      {label:'📷 DSLR Photo', boost:', dslr photograph, 50mm lens, bokeh background, natural skin tones, high detail'},
    cyberpunk:  {label:'🌃 Cyberpunk',  boost:', cyberpunk style, neon lights, futuristic city, blade runner atmosphere, cinematic'},
    watercolor: {label:'💧 Watercolor', boost:', watercolor painting, soft flowing colors, artistic, paper texture, delicate'}
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
    const prompt=input.value.trim();
    if(!prompt){ setS('⚠️ Pehle likho kya banana hai'); return; }
    const parts=selSize.value.split('x');
    const model=selModel.value;
    currentSeed=Math.floor(Math.random()*999999);
    const full=prompt + STYLES[selectedStyle].boost + ', masterpiece, best quality, highly detailed';
    currentURL='https://image.pollinations.ai/prompt/'+encodeURIComponent(full)
      +'?width='+parts[0]+'&height='+parts[1]
      +'&seed='+currentSeed+'&model='+model+'&nologo=true';
    btn.disabled=true; btn.textContent='⏳ Generating…';
    wrap.classList.remove('hidden');
    setS(model==='flux' ? '🎨 Quality mode: 20-50 sec…' : '⚡ Fast mode: 5-15 sec…');
    img.onload=()=>{
      btn.disabled=false; btn.textContent='🎨 Generate';
      setS('✅ Ready! Download karo ya 🔄 New Variation banao.');
      wrap.scrollIntoView({behavior:'smooth',block:'nearest'});
    };
    img.onerror=()=>{
      btn.disabled=false; btn.textContent='🎨 Generate';
      setS('❌ Server busy — 10 sec baad dubara try karo.');
    };
    img.src=currentURL;
  }

  btn.addEventListener('click', generate);
  input.addEventListener('keydown', e=>{ if(e.key==='Enter') generate(); });
  again.addEventListener('click', generate);

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
