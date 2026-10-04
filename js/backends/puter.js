/* SriGen Backend: PUTER.JS (KEYLESS!)
   WORKING — no API key, browser mein direct.
   Free tier hai (fair-use limits), premium models paid.
   ============================================ */
window.GUPT = window.GUPT || {};
GUPT.backends = GUPT.backends || {};

GUPT.backends.puter={
  id:'puter', name:'Puter (Keyless)', emoji:'🆓', enabled:true,
  fields:[],
  async generate(prompt, styleBoost, hint){
    if(!window.puter) throw new Error('Puter library load nahi hui (internet check karo)');
    const full=prompt+', '+styleBoost+', '+hint+', high quality, detailed';
    // Puter v2: txt2img returns Blob (ya URL string)
    const result=await puter.ai.txt2img(full, {model:'flux-schnell'});
    if(result instanceof Blob) return result;
    if(typeof result==='string'){
      const r=await fetch(result);
      return await r.blob();
    }
    throw new Error('Puter: unexpected response');
  }
};
