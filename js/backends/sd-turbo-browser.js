/* SriGen Backend: SD-TURBO (BROWSER, EXPERIMENTAL)
   FUTURE — model ~2GB, external hosting chahiye. Abhi disabled.
   ============================================ */
window.GUPT = window.GUPT || {};
GUPT.backends = GUPT.backends || {};

GUPT.backends['sd-turbo']={
  id:'sd-turbo', name:'SD-Turbo (Browser)', emoji:'💻', enabled:false,
  note:'Model ~2GB — GitHub 100MB limit ke bahar. HuggingFace pe host karke baad mein enable karenge.',
  fields:[],
  async generate(){ throw new Error('SD-Turbo browser version — model hosting pending'); }
};
