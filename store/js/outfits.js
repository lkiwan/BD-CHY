/* ============================================================
   SURMOI — Tenues libres (Option 1, choix d'Omar 2026-11-07)
   L'utilisateur choisit librement un haut + un bas. Si la photo
   de CETTE combinaison existe (window.OUTFITS), le personnage
   l'affiche ; sinon on garde la vue pièce par pièce, et la
   combinaison sera générée une fois puis gardée (voir LOGIC.md,
   règle 1 : « à générer »). Clé : 't<haut>-b<bas>' (index dans
   data.js). Les chaussures rejoindront la clé plus tard.
   ============================================================ */
/* Photos de looks : générées en groupes de 4 (un haut fixe, 4 bas),
   même personnage que les planches, découpées en singles ensuite.
   Faites : t0 (Basic T-shirt) × b0..b3. Restent : t0-b4 (shorts),
   puis t1..t4 (sweater, chemise, hoodie, ringer) × b0..b4. */
window.OUTFITS = {
  /* rempli au fur et à mesure que les photos de looks sont créées */
  't0-b0': 'assets/outfits/t0-b0.webp',  /* Basic T-shirt + Charcoal Trousers */
  't0-b1': 'assets/outfits/t0-b1.webp',  /* Basic T-shirt + Blue Jeans */
  't0-b2': 'assets/outfits/t0-b2.webp',  /* Basic T-shirt + Beige Chinos */
  't0-b3': 'assets/outfits/t0-b3.webp'   /* Basic T-shirt + Black Joggers */
};

(function () {
  var img = document.getElementById('outfitImg');
  if (!img) return;
  var mCur = document.getElementById('mCur');
  var mNext = document.getElementById('mNext');
  var sel = window.SURMOI_SEL || (window.SURMOI_SEL = { tops: null, bottoms: null, shoes: null });

  function comboKey() {
    if (sel.tops == null || sel.bottoms == null) return null;
    return 't' + sel.tops + '-b' + sel.bottoms;
  }
  function refresh() {
    var k = comboKey();
    var src = k ? window.OUTFITS[k] : null;
    window.SURMOI_COMBO = src ? k : null;
    if (src) {
      if (img.getAttribute('src') !== src) img.src = src;
      img.hidden = false;
      /* force le navigateur à peindre avant la transition */
      void img.offsetWidth;
      img.classList.add('on');
      /* visibility (pas seulement opacity) : la fin du scan de tryOn
         réécrit opacity à 1 — la tête de la planche dépassait sinon. */
      if (mCur) { mCur.style.opacity = '0'; mCur.style.visibility = 'hidden'; }
      if (mNext) { mNext.style.opacity = '0'; mNext.style.visibility = 'hidden'; }
    } else {
      img.classList.remove('on');
      img.hidden = true;
      if (mCur) mCur.style.visibility = '';
      if (mNext) mNext.style.visibility = '';
    }
  }
  window.SURMOI_OUTFIT_REFRESH = refresh;
  refresh();
})();
