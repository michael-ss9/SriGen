/* SriGen Backend: IA.GRATIS
   PLACEHOLDER — is service ka public API nahi mila.
   API milega toh yahan code aayega.
   ============================================ */
window.GUPT = window.GUPT || {};
GUPT.backends = GUPT.backends || {};

GUPT.backends['iagratis']={
  id:'iagratis', name:'IA.Gratis', emoji:'🆓', enabled:false,
  note:'Public API nahi mila — agar API endpoint/documentation mile toh batao, main connect kar dunga.',
  fields:[],
  async generate(){ throw new Error('IA.Gratis: API pending'); }
};
