/* ============================================================
   LBS — Commander
   Le bouton « Commander » de la carte d'achat ouvre le panneau :
   récap (produit / taille / couleur lus dans la carte), quantité,
   nom + téléphone + ville, puis envoi sur WhatsApp (wa.me).
   Paiement à la livraison ; la commande est aussi gardée dans le
   téléphone (vf_commandes). Voir LOGIC.md.
   ------------------------------------------------------------
   ⚠️ NUMÉRO : mettre le WhatsApp d'Omar ci-dessous (format
   international sans + , ex. '2126XXXXXXXX'). Vide = WhatsApp
   ouvre le choix du contact.
   ============================================================ */
(function () {
  var NUMERO_WHATSAPP = '';

  var btn = document.getElementById('orderBtn');
  var sec = document.getElementById('commande');
  if (!btn || !sec) return;
  var el = function (id) { return document.getElementById(id); };
  var qty = 1, cur = null;

  function lastText(id) {
    var ln = el(id); if (!ln) return '';
    var spans = ln.querySelectorAll('.stack span');
    return spans.length ? spans[spans.length - 1].textContent.trim() : '';
  }
  function readCard() {
    var priceTxt = lastText('priceLn');
    var sizeChip = document.querySelector('#buy .chip.act');
    return {
      produit: lastText('nameLn'),
      prix: parseFloat((priceTxt || '').replace(/[^0-9.]/g, '')) || 0,
      devise: (priceTxt || '').replace(/[0-9.\s]/g, '') || '',
      taille: sizeChip ? sizeChip.textContent.trim() : '',
      couleur: lastText('colorLn').replace(/^Color\s*·\s*/, '')
    };
  }
  function fmt(n) { return (Math.round(n * 100) / 100).toString(); }
  function renderTotal() { if (cur) el('oTotal').textContent = cur.devise + fmt(cur.prix * qty); }

  function open() {
    cur = readCard();
    qty = 1;
    el('oQty').textContent = '1';
    el('oProduit').textContent = cur.produit || '—';
    el('oVariante').textContent = (cur.taille || '—') + ' · ' + (cur.couleur || '—');
    el('oErr').textContent = '';
    renderTotal();
    sec.classList.add('o-open');
  }
  btn.addEventListener('click', open);
  el('oClose').addEventListener('click', function () { sec.classList.remove('o-open'); });
  el('oMinus').addEventListener('click', function () { if (qty > 1) { qty--; el('oQty').textContent = qty; renderTotal(); } });
  el('oPlus').addEventListener('click', function () { if (qty < 9) { qty++; el('oQty').textContent = qty; renderTotal(); } });

  el('oSend').addEventListener('click', function () {
    if (!cur) cur = readCard();
    var nom = el('oNom').value.trim();
    var telDigits = el('oTel').value.replace(/[^0-9]/g, '');
    var ville = el('oVille').value.trim();
    if (nom.length < 2) { el('oErr').textContent = 'Écris ton nom.'; return; }
    if (telDigits.length < 9) { el('oErr').textContent = 'Écris un numéro de téléphone correct.'; return; }
    if (ville.length < 2) { el('oErr').textContent = 'Écris ta ville.'; return; }
    el('oErr').textContent = '';
    var total = cur.devise + fmt(cur.prix * qty);
    var msg = 'Nouvelle commande LBS\n' +
      'Produit : ' + cur.produit + '\n' +
      'Taille : ' + cur.taille + ' · Couleur : ' + cur.couleur + '\n' +
      'Quantité : ' + qty + '\n' +
      'Total : ' + total + ' (paiement à la livraison)\n' +
      'Nom : ' + nom + '\n' +
      'Téléphone : ' + el('oTel').value.trim() + '\n' +
      'Ville : ' + ville;
    var url = NUMERO_WHATSAPP
      ? 'https://wa.me/' + NUMERO_WHATSAPP + '?text=' + encodeURIComponent(msg)
      : 'https://api.whatsapp.com/send?text=' + encodeURIComponent(msg);
    window.LBS_ORDER = { message: msg, url: url };
    try {
      var list = JSON.parse(localStorage.getItem('vf_commandes') || '[]');
      list.push({ produit: cur.produit, taille: cur.taille, couleur: cur.couleur, quantite: qty, total: total, nom: nom, telephone: el('oTel').value.trim(), ville: ville, date: new Date().toISOString() });
      localStorage.setItem('vf_commandes', JSON.stringify(list.slice(-50)));
    } catch (e) { /* stockage indisponible */ }
    window.open(url, '_blank');
  });
})();
