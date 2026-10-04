/* SriGen Backend: CLOUDFLARE WORKERS AI (FLUX SCHNELL)
   WORKING — free ~400/day, keys: dash.cloudflare.com
   ============================================ */
window.GUPT = window.GUPT || {};
GUPT.backends = GUPT.backends || {};

GUPT.backends.cloudflare={
  id:'cloudflare', name:'Cloudflare Flux', emoji:'☁️', enabled:true,
  fields:[
    {storage:'srigen_cf_acct', label:'☁️ Cloudflare Account ID (dash.cloudflare.com → dashboard mein)'},
    {storage:'srigen_cf_token', label:'☁️ Cloudflare API Token (Workers AI permission ke saath)'}
  ],
  async generate(prompt, styleBoost, hint){
    const acct=localStorage.getItem('srigen_cf_acct');
    const token=localStorage.getItem('srigen_cf_token');
    if(!acct||!token) throw new Error('Cloudflare keys nahi hain');
    const sizes={'1:1 square aspect ratio':[1024,1024],'16:9 widescreen aspect ratio':[1280,720],'9:16 vertical portrait aspect ratio':[720,1280]};
    const wh=sizes[hint]||[1024,1024];
    const resp=await fetch('https://api.cloudflare.com/client/v4/accounts/'+acct+'/ai/run/@cf/black-forest-labs/flux-1-schnell',{
      method:'POST',
      headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},
      body:JSON.stringify({prompt:prompt+', '+styleBoost+', '+hint, width:wh[0], height:wh[1], num_inference_steps:4})
    });
    if(!resp.ok) throw new Error('Cloudflare error '+resp.status);
    const blob=await resp.blob();
    if(blob.size<3000) throw new Error('Cloudflare ne error image bheji');
    return blob;
  }
};
