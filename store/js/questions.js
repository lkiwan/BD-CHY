/* ============================================================
   SURMOI — Les 6 questions (ordre validé par Omar) :
   Sexe → Âge → Forme → Taille → Poids → Peau (= choix de l'avatar).
   L'âge choisit la tranche : 14–19 = jeune, 20+ = adulte.
   Chaque question = un plein écran ; on touche un personnage
   (ou une ligne) → réponse + question suivante.
   Résultat gardé dans le téléphone : vf_avatar + vf_corps.
   ============================================================ */
(function () {
  var sec = document.getElementById('questions');
  if (!sec) return;
  var zone = document.getElementById('qZone');
  var foot = document.getElementById('qFoot');
  var label = document.getElementById('qLabel');
  var barFill = document.getElementById('qBarFill');
  var title = document.getElementById('qTitle');
  var sub = document.getElementById('qSub');
  var backBtn = document.getElementById('qBack');
  var closeBtn = document.getElementById('qClose');

  var FORMES = {
    homme: [
      { id: 'droit', nom: 'Droit' },
      { id: 'equilibre', nom: 'Équilibré' },
      { id: 'muscle', nom: 'Musclé', zoom: true },
      { id: 'rond', nom: 'Rond' }
    ],
    femme: [
      { id: 'droite', nom: 'Droite' },
      { id: 'poire', nom: 'Poire' },
      { id: 'sablier', nom: 'Sablier', zoom: true },
      { id: 'ronde', nom: 'Ronde' },
      { id: 'epaules-larges', nom: 'Épaules larges' }
    ]
  };
  var AGES = [
    { t: '14 – 17', tranche: 'jeune' },
    { t: '18 – 19', tranche: 'jeune' },
    { t: '20 – 29', tranche: 'adulte' },
    { t: '30 – 44', tranche: 'adulte' },
    { t: 'Plus de 44', tranche: 'adulte' }
  ];
  var TAILLES = ['Moins de 160', '160 – 170', '170 – 180', '180 – 190', 'Plus de 190'];
  var POIDS = ['Moins de 60', '60 – 75', '75 – 90', '90 – 105', 'Plus de 105'];
  var PEAUX = [
    { id: 'claire', nom: 'Claire' },
    { id: 'moyenne', nom: 'Moyenne' },
    { id: 'foncee', nom: 'Foncée' }
  ];
  /* Corps par défaut (entrée directe + question 1) */
  var DEFAUTS = { homme: 'homme-droit-moyenne', femme: 'femme-sablier-moyenne' };

  function fichier(sexe, forme, tranche, peau) {
    return sexe + '-' + forme + (tranche === 'jeune' ? '-jeune' : '') + '-' + peau;
  }
  function img(id) { return 'assets/bodies/web/' + id + '.jpg'; }

  var S;         /* réponses en cours */
  var step;      /* 1..6, 7 = résultat */
  var hist = []; /* retour en arrière */

  function reset() {
    S = { sexe: null, age: null, tranche: null, forme: null, formeNom: null, taille: null, poids: null, peau: null, peauNom: null };
    step = 1; hist = [];
  }

  function card(idPhoto, nom, zoom, extraCls, extraAttrs) {
    return '<button class="q-card ' + (extraCls || '') + '" type="button" data-pick="' + idPhoto + '" data-nom="' + nom + '"' + (extraAttrs || '') + '>' +
      '<img src="' + img(idPhoto) + '" alt=""' + (zoom ? ' class="q-zoom"' : '') + '>' +
      '<span class="q-pill">' + nom + '</span></button>';
  }
  function row(valeur, unite) {
    return '<button class="q-row" type="button" data-pick="' + valeur + '"><b>' + valeur + '</b><span>' + unite + '</span></button>';
  }

  function render() {
    backBtn.classList.toggle('q-show', step > 1 && step <= 6);
    closeBtn.classList.add('q-show');
    zone.innerHTML = '';
    if (step === 1) {
      label.textContent = 'QUESTION 1 SUR 6'; barFill.style.width = '17%';
      title.textContent = 'Tu es... ?'; sub.textContent = 'Touche ton personnage';
      zone.innerHTML = '<div class="q-cards2">' +
        card(DEFAUTS.homme, 'Homme') + card(DEFAUTS.femme, 'Femme', true) + '</div>';
      foot.textContent = 'Aucun compte nécessaire — tu pourras changer plus tard';
    } else if (step === 2) {
      label.textContent = 'QUESTION 2 SUR 6'; barFill.style.width = '33%';
      title.textContent = 'Ton âge ?'; sub.textContent = "Touche ta tranche d'âge";
      zone.innerHTML = '<div class="q-rows">' + AGES.map(function (a) { return row(a.t, 'ans'); }).join('') + '</div>';
      foot.textContent = "L'âge aide le magasin à recommander la bonne taille";
    } else if (step === 3) {
      label.textContent = 'QUESTION 3 SUR 6'; barFill.style.width = '50%';
      title.textContent = 'Ta forme ?'; sub.textContent = 'Touche le corps qui te ressemble';
      var fs = FORMES[S.sexe];
      zone.innerHTML = '<div class="q-grid' + (fs.length > 4 ? ' q-tight' : '') + '">' + fs.map(function (f, i) {
        return card(fichier(S.sexe, f.id, S.tranche, 'moyenne'), f.nom, f.zoom, (fs.length > 4 && i === fs.length - 1) ? 'q-last' : '', ' data-forme="' + f.id + '"');
      }).join('') + '</div>';
      foot.textContent = 'Les vêtements tombent mieux sur un corps comme le tien';
    } else if (step === 4) {
      label.textContent = 'QUESTION 4 SUR 6'; barFill.style.width = '67%';
      title.textContent = 'Ta taille ?'; sub.textContent = 'Touche ta hauteur — ça aide pour les tailles';
      zone.innerHTML = '<div class="q-rows">' + TAILLES.map(function (t) { return row(t, 'cm'); }).join('') + '</div>';
      foot.textContent = 'Un magasin pro ajuste les vêtements à ton corps';
    } else if (step === 5) {
      label.textContent = 'QUESTION 5 SUR 6'; barFill.style.width = '83%';
      title.textContent = 'Ton poids ?'; sub.textContent = 'Touche ta tranche — ça aide pour les tailles';
      zone.innerHTML = '<div class="q-rows">' + POIDS.map(function (t) { return row(t, 'kg'); }).join('') + '</div>';
      foot.textContent = 'Un magasin pro ajuste les vêtements à ton corps';
    } else if (step === 6) {
      label.textContent = 'QUESTION 6 SUR 6'; barFill.style.width = '100%';
      title.textContent = 'Choisis ton avatar'; sub.textContent = "Touche ton corps — c'est ton avatar";
      zone.innerHTML = '<div class="q-cards3">' + PEAUX.map(function (p) {
        return card(fichier(S.sexe, S.forme, S.tranche, p.id), p.nom, S.forme === 'sablier' || S.forme === 'muscle');
      }).join('') + '</div>';
      foot.textContent = 'Tu pourras mettre ton propre visage plus tard';
    } else if (step === 7) {
      label.textContent = 'TON AVATAR'; barFill.style.width = '100%';
      title.textContent = 'Voici ton avatar'; sub.textContent = 'Le magasin va habiller ce corps';
      var idA = fichier(S.sexe, S.forme, S.tranche, S.peau);
      var sexeNom = S.sexe === 'homme' ? 'Homme' : 'Femme';
      zone.innerHTML =
        '<div class="q-result-img"><img src="' + img(idA) + '" alt="Ton avatar"></div>' +
        '<div class="q-chips">' +
        '<span class="q-chip">' + sexeNom + '</span>' +
        '<span class="q-chip">' + S.age + ' ans</span>' +
        '<span class="q-chip">' + S.formeNom + '</span>' +
        '<span class="q-chip">' + S.taille + ' cm</span>' +
        '<span class="q-chip">' + S.poids + ' kg</span>' +
        '<span class="q-chip">Peau ' + S.peauNom.toLowerCase() + '</span></div>' +
        '<button class="q-enter" type="button" id="qEnter">Entrer dans le magasin</button>' +
        '<button class="q-restart" type="button" id="qRestart">Recommencer</button>';
      foot.textContent = 'Ton avatar est gardé dans ton téléphone';
      document.getElementById('qEnter').addEventListener('click', finish);
      document.getElementById('qRestart').addEventListener('click', function () { reset(); render(); });
    }
  }

  function answer(val, nom, formeId) {
    hist.push(step);
    if (step === 1) { S.sexe = val === DEFAUTS.homme ? 'homme' : 'femme'; }
    else if (step === 2) {
      S.age = val;
      for (var i = 0; i < AGES.length; i++) if (AGES[i].t === val) S.tranche = AGES[i].tranche;
    }
    else if (step === 3) { S.forme = formeId; S.formeNom = nom; }
    else if (step === 4) { S.taille = val; }
    else if (step === 5) { S.poids = val; }
    else if (step === 6) { S.peau = val.split('-').pop(); S.peauNom = nom; }
    step++;
    render();
  }

  zone.addEventListener('click', function (e) {
    var el = e.target.closest('[data-pick]');
    if (!el || step === 7) return;
    el.classList.add('q-pick');
    var val = el.getAttribute('data-pick'), nom = el.getAttribute('data-nom'), fid = el.getAttribute('data-forme');
    setTimeout(function () { answer(val, nom, fid); }, 170);
  });

  backBtn.addEventListener('click', function () {
    if (!hist.length) return;
    step = hist.pop();
    render();
  });
  closeBtn.addEventListener('click', function () { close(); });

  function close() { sec.classList.remove('q-open'); }

  function finish() {
    var idA = fichier(S.sexe, S.forme, S.tranche, S.peau);
    var data = {
      sexe: S.sexe, tranche: S.tranche, forme: S.forme, peau: S.peau,
      age: S.age, taille: S.taille, poids: S.poids,
      avatar: idA, image: img(idA), type: 'defaut'
    };
    try {
      localStorage.setItem('vf_avatar', JSON.stringify(data));
      localStorage.setItem('vf_corps', data.image);
    } catch (e) { /* stockage indisponible : le magasin s'ouvre quand même */ }
    window.SURMOI_AVATAR = data;
    close();
    var acc = document.getElementById('accueil');
    if (acc) {
      acc.classList.add('acc-hide');
      setTimeout(function () { acc.style.display = 'none'; }, 480);
    }
  }

  /* Point d'entrée appelé par l'Accueil (bouton « Créer mon avatar ») */
  window.SURMOI_OPEN_QUESTIONS = function () { reset(); render(); sec.classList.add('q-open'); };
  window.SURMOI_DEFAUT = DEFAUTS;
  window.SURMOI_IMG = img;
})();
