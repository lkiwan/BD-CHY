/* ============================================================
   LBS — Avatar personnel : « Mets ton propre visage »
   1) Le client enregistre son corps + la pièce.
   2) Bouton « Copier le prompt » : le prompt REMPLI avec ses
      réponses aux 6 questions (PROMPT-AVATAR.md, format validé
      par Omar le 2026-11-07 : 1 image, corps à gauche, visage
      à droite sur fond vert pur).
   3) Il téléverse l'image reçue : l'app trouve la moitié verte,
      découpe le visage tout seul (chrominance, même recette que
      les planches) et le garde dans le téléphone (vf_face).
   ============================================================ */
(function () {
  var sec = document.getElementById('visage');
  if (!sec) return;
  var bodyImg = document.getElementById('vBodyImg');
  var bodyDl = document.getElementById('vBodyDl');
  var copyBtn = document.getElementById('vCopy');
  var copied = document.getElementById('vCopied');
  var fileIn = document.getElementById('vFile');
  var result = document.getElementById('vResult');
  var faceImg = document.getElementById('vFaceImg');
  var errEl = document.getElementById('vErr');
  var SITE = 'https://lkiwan.github.io/BD-CHY/store/';

  var FORMES_TXT = {
    homme: {
      droit: 'DROIT — straight body, shoulders and hips at about the same width, no strong curves',
      equilibre: 'ÉQUILIBRÉ — balanced body, shoulders a little wider than the waist',
      muscle: 'MUSCLÉ — muscular body, very broad shoulders, narrow waist',
      rond: 'ROND — round body, fullness in the middle'
    },
    femme: {
      droite: 'DROITE — straight body, bust, waist and hips at about the same width',
      poire: 'POIRE — pear body, hips clearly wider than shoulders',
      sablier: 'SABLIER — hourglass body, bust and hips balanced, waist clearly smaller',
      ronde: 'RONDE — round body, fullness in the middle',
      'epaules-larges': 'ÉPAULES LARGES — broad-shouldered body, shoulders and bust wider than hips'
    }
  };
  var PEAUX_EN = { claire: 'LIGHT', moyenne: 'MEDIUM', foncee: 'DARK' };

  function avatarData() {
    if (window.LBS_AVATAR) return window.LBS_AVATAR;
    try { return JSON.parse(localStorage.getItem('vf_avatar') || 'null'); } catch (e) { return null; }
  }

  function buildPrompt(d) {
    var sexeMot = d.sexe === 'homme' ? 'MAN' : 'WOMAN';
    var formeTxt = (FORMES_TXT[d.sexe] || {})[d.forme] || d.forme;
    var haut = /^(180|Plus de 190)/.test(d.taille || '');
    var blocHauteur = haut
      ? '- My height: ' + d.taille + ' cm — I am TALL.\n'
      : '- My height: ' + d.taille + ' cm.\n';
    var ligneHauteur = haut
      ? 'MY HEIGHT: I am tall — make me LOOK tall: long legs, my head is about 1/8 of my total height.\n'
      : 'MY HEIGHT: keep my natural proportions for my height.\n';
    return 'Here is my personal avatar request for the LBS shop.\n\n' +
      'MY ANSWERS (from the shop\'s questions — use these, do not ask me again):\n' +
      '- I am a ' + sexeMot + '.\n' +
      '- My body shape: ' + formeTxt + '.\n' +
      blocHauteur +
      '- My skin tone: ' + (PEAUX_EN[d.peau] || 'MEDIUM') + '.\n\n' +
      'THE PICTURES I ATTACHED:\n' +
      '1. MY PHOTO — my real face.\n' +
      '2. MY BODY — the exact body I chose in the shop. (Backup link: ' + SITE + d.image + ')\n' +
      '3. THE SHOP\'S ROOM — the shop\'s background. (Backup link: ' + SITE + 'assets/fond-magasin.jpg)\n' +
      'Use these exact attached pictures. Never invent a similar body or a similar room.\n\n' +
      'CREATE MY PICTURE:\n' +
      'Create exactly ONE single picture of me, with TWO separate parts side by side: the LEFT part takes about 55% of the width, the RIGHT part about 45%. Do not merge the two parts. No text, no labels.\n' +
      'My face must stay 100% recognizable — same face, same hair, same skin tone as my photo. Keep my real proportions: do NOT slim me, do NOT make me more muscular, do NOT beautify me, no filters. Photorealistic, high resolution.\n\n' +
      'LEFT PART — MY BODY ALONE:\n' +
      'My full body, alone, standing straight and centered. Take the exact attached BODY and put my real face and my real hair on it, blended naturally at the neck, skin tone matching the body. Everything else stays exactly like the body picture: same proportions, same pose, same clothes (white t-shirt, blue jeans, white sneakers), my whole body visible from the top of my head to my feet.\n' +
      ligneHauteur +
      'BACKGROUND of the left part: the attached shop room, exactly as it is — I stand in the center, on the floor, soft natural shadow under my feet.\n\n' +
      'RIGHT PART — MY FACE ALONE:\n' +
      'A close-up of only my head and neck, alone, facing the camera directly, head perfectly straight, eyes open looking at the camera, neutral expression, mouth closed, no sunglasses, no hat, all my hair visible. Even frontal lighting, no shadows on my face, sharp focus on my eyes.\n' +
      'BACKGROUND of the right part: pure solid green, exactly #00FF00 — only behind my face, on this part of the picture.';
  }

  var promptTxt = '';
  function refresh() {
    var d = avatarData();
    if (!d) return;
    bodyImg.src = d.image;
    bodyDl.href = d.image;
    promptTxt = buildPrompt(d);
    window.LBS_PROMPT = promptTxt;
  }

  copyBtn.addEventListener('click', function () {
    if (!promptTxt) refresh();
    function done() { copied.hidden = false; setTimeout(function () { copied.hidden = true; }, 2200); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(promptTxt).then(done, function () { fallback(); done(); });
    } else { fallback(); done(); }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = promptTxt; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) { /* copie manuelle */ }
      document.body.removeChild(ta);
    }
  });

  /* ---------- Découpe du visage dans la moitié verte ---------- */
  function isGreen(r, g, b) { return g > 110 && (g - Math.max(r, b)) > 48; }

  function extractFace(img) {
    var maxW = 1400;
    var scale = Math.min(1, maxW / img.naturalWidth);
    var W = Math.round(img.naturalWidth * scale), H = Math.round(img.naturalHeight * scale);
    var cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var cx = cv.getContext('2d'); cx.drawImage(img, 0, 0, W, H);
    var data = cx.getImageData(0, 0, W, H).data;
    function greenAt(x, y) { var i = (y * W + x) * 4; return isGreen(data[i], data[i + 1], data[i + 2]); }
    /* 1) la séparation : première colonne « verte » durable, dès 25% de la largeur */
    var split = -1;
    for (var x = Math.floor(W * 0.25); x < W - 14; x += 2) {
      var ok = 0, tot = 0;
      for (var y = 4; y < H; y += 6) { tot++; if (greenAt(x, y)) ok++; }
      if (tot && ok / tot > 0.8) {
        var durable = true;
        for (var k = 2; k <= 12; k += 2) {
          var ok2 = 0, tot2 = 0;
          for (var y2 = 4; y2 < H; y2 += 6) { tot2++; if (greenAt(x + k, y2)) ok2++; }
          if (!tot2 || ok2 / tot2 <= 0.8) { durable = false; break; }
        }
        if (durable) { split = x; break; }
      }
    }
    if (split < 0) return null;
    /* 2) la boîte du visage : pixels non verts dans la moitié droite */
    var regW = W - split;
    var minX = W, maxX = split - 1, minY = H, maxY = -1;
    var rowCount = new Array(H).fill(0), colCount = new Array(W).fill(0);
    for (var yy = 0; yy < H; yy += 2) {
      for (var xx = split; xx < W; xx += 2) {
        if (!greenAt(xx, yy)) { rowCount[yy]++; colCount[xx]++; }
      }
    }
    for (var r = 0; r < H; r++) if (rowCount[r] > regW * 0.012) { if (r < minY) minY = r; if (r > maxY) maxY = r; }
    for (var c = split; c < W; c++) if (colCount[c] > H * 0.012) { if (c < minX) minX = c; if (c > maxX) maxX = c; }
    if (maxX < minX || maxY < minY || (maxX - minX) < regW * 0.15 || (maxY - minY) < H * 0.2) return null;
    var mX = (maxX - minX) * 0.06, mY = (maxY - minY) * 0.06;
    minX = Math.max(split, Math.floor(minX - mX)); maxX = Math.min(W - 1, Math.ceil(maxX + mX));
    minY = Math.max(0, Math.floor(minY - mY)); maxY = Math.min(H - 1, Math.ceil(maxY + mY));
    var bw = maxX - minX + 1, bh = maxY - minY + 1;
    /* 3) le visage recadré (JPEG) + le visage détouré (PNG, chrominance) */
    var crop = document.createElement('canvas'); crop.width = bw; crop.height = bh;
    crop.getContext('2d').drawImage(cv, minX, minY, bw, bh, 0, 0, bw, bh);
    var jpg = crop.toDataURL('image/jpeg', 0.88);
    var px = crop.getContext('2d').getImageData(0, 0, bw, bh);
    var pd = px.data;
    for (var i = 0; i < pd.length; i += 4) {
      var rr = pd[i], gg = pd[i + 1], bb = pd[i + 2];
      var d = gg - Math.max(rr, bb);
      var a = d <= 8 ? 255 : (d >= 55 ? 0 : Math.round(255 * (55 - d) / 47));
      if (a < 255) pd[i + 1] = Math.min(gg, Math.max(rr, bb) + 8); /* despill */
      pd[i + 3] = a;
    }
    crop.getContext('2d').putImageData(px, 0, 0);
    var png = crop.toDataURL('image/png');
    return { jpg: jpg, png: png, split: split, box: [minX, minY, bw, bh] };
  }

  var lastFace = null;
  fileIn.addEventListener('change', function () {
    errEl.textContent = '';
    result.hidden = true;
    lastFace = null;
    var f = fileIn.files && fileIn.files[0];
    if (!f) return;
    var url = URL.createObjectURL(f);
    var img = new Image();
    img.onload = function () {
      var out = extractFace(img);
      URL.revokeObjectURL(url);
      if (!out) {
        errEl.textContent = "Je ne trouve pas ton visage sur fond vert dans cette image. Utilise bien l'image donnée par le générateur (corps à gauche, visage à droite sur fond vert).";
        return;
      }
      lastFace = out;
      window.LBS_FACE = out;
      faceImg.src = out.png;
      result.hidden = false;
    };
    img.onerror = function () { errEl.textContent = "Cette image ne s'ouvre pas — essaie une autre."; };
    img.src = url;
  });

  document.getElementById('vRedo').addEventListener('click', function () {
    result.hidden = true; lastFace = null; fileIn.value = ''; errEl.textContent = '';
  });

  document.getElementById('vKeep').addEventListener('click', function () {
    if (!lastFace) return;
    try {
      localStorage.setItem('vf_face', lastFace.jpg);
      localStorage.setItem('vf_face_cut', lastFace.png);
      var d = avatarData();
      if (d) { d.type = 'personnel'; d.face = true; localStorage.setItem('vf_avatar', JSON.stringify(d)); window.LBS_AVATAR = d; }
    } catch (e) { /* stockage plein : on continue quand même */ }
    sec.classList.remove('v-open');
    var q = document.getElementById('questions');
    if (q) q.classList.remove('q-open');
    var acc = document.getElementById('accueil');
    if (acc) { acc.classList.add('acc-hide'); setTimeout(function () { acc.style.display = 'none'; }, 480); }
  });

  document.getElementById('vClose').addEventListener('click', function () { sec.classList.remove('v-open'); });

  window.LBS_OPEN_VISAGE = function () { refresh(); sec.classList.add('v-open'); };
})();
