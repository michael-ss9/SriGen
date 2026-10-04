/* SriGen Backend: GOOGLE GEMINI
   WORKING — free 1500/day, key: aistudio.google.com
   ============================================ */
window.GUPT = window.GUPT || {};
GUPT.backends = GUPT.backends || {};

GUPT.backends.gemini={
  id:'gemini', name:'Google Gemini', emoji:'🤖', enabled:true,
  fields:[{storage:'srigen_gemini', label:'🔑 Gemini Key (free — aistudio.google.com)'}],
  async generate(prompt, styleBoost, hint){
    const key=localStorage.getItem('srigen_gemini');
    if(!key) throw new Error('Gemini key nahi hai');
    const full='Generate a high quality image: '+prompt+', '+styleBoost+', '+hint+', detailed, professional';
    const models=['gemini-2.5-flash-image','gemini-2.0-flash-preview-image-generation'];
    for(const m of models){
      const resp=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+m+':generateContent?key='+encodeURIComponent(key),{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({contents:[{parts:[{text:full}]}],generationConfig:{responseModalities:['IMAGE']}})
      });
      if(resp.status===400||resp.status===403) throw new Error('Gemini key galat hai');
      if(!resp.ok) continue;
      const data=await resp.json();
      const parts=(data.candidates&&data.candidates[0]&&data.candidates[0].content&&data.candidates[0].content.parts)||[];
      for(const p of parts){
        if(p.inlineData&&p.inlineData.data){
          const bin=atob(p.inlineData.data);
          const arr=new Uint8Array(bin.length);
          for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);
          return new Blob([arr],{type:p.inlineData.mimeType||'image/png'});
        }
      }
    }
    throw new Error('Gemini models fail');
  }
};
