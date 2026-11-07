/* SURMOI — Accueil : chaque entrée ferme la première page et ouvre le magasin.
   Le choix est gardé (window.SURMOI_ENTRY) pour la suite du flux (avatar par défaut, création…). */
(function () {
  var acc = document.getElementById('accueil');
  if (!acc) return;
  acc.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-enter]');
    if (!btn) return;
    window.SURMOI_ENTRY = btn.getAttribute('data-enter');
    acc.classList.add('acc-hide');
    setTimeout(function () { acc.style.display = 'none'; }, 480);
  });
})();
