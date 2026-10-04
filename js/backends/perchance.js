/* SriGen Backend: PERCHANCE
   PLACEHOLDER — is service ka public API nahi mila.
   ============================================ */
window.GUPT = window.GUPT || {};
GUPT.backends = GUPT.backends || {};

GUPT.backends['perchance']={
  id:'perchance', name:'Perchance', emoji:'🎲', enabled:false,
  note:'Public API nahi mila — agar API endpoint/documentation mile toh batao, main connect kar dunga.',
  fields:[],
  async generate(){ throw new Error('Perchance: API pending'); }
};
