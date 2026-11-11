/* LBS — Accueil : les entrées de la première page.
   « Créer mon avatar » ouvre les 6 questions (js/questions.js).
   Homme / Femme = entrée directe : avatar par défaut gardé dans le
   téléphone, puis le magasin s'ouvre. « Se connecter » ouvre aussi
   le magasin pour l'instant (comptes à venir). */
(function () {
  var acc = document.getElementById('accueil');
  if (!acc) return;

  function enterShop() {
    acc.classList.add('acc-hide');
    setTimeout(function () { acc.style.display = 'none'; }, 480);
  }

  acc.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-enter]');
    if (!btn) return;
    var entry = btn.getAttribute('data-enter');
    window.LBS_ENTRY = entry;
    if (entry === 'creer' && typeof window.LBS_OPEN_QUESTIONS === 'function') {
      window.LBS_OPEN_QUESTIONS();
      return;
    }
    if ((entry === 'homme' || entry === 'femme') && window.LBS_DEFAUT) {
      var id = window.LBS_DEFAUT[entry];
      var data = { sexe: entry, avatar: id, image: window.LBS_IMG(id), type: 'defaut' };
      try {
        localStorage.setItem('vf_avatar', JSON.stringify(data));
        localStorage.setItem('vf_corps', data.image);
      } catch (err) { /* stockage indisponible : on entre quand même */ }
      window.LBS_AVATAR = data;
    }
    enterShop();
    /* Femme entry test (2026-11-09): the 3D model replaces the
       2D model in the shop, so Omar can see how it looks there. */
    if (entry === 'femme' && typeof window.LBS_OPEN_3D === 'function') {
      window.LBS_OPEN_3D();
    }
  });
})();
