/* ============================================================
   LBS 2D — ALL LANGUAGES IN ONE FILE
   ------------------------------------------------------------
   Every word the page shows lives here, in French and English.
   To change any text, or to fix a translation, edit ONLY this
   file — data.js keeps prices / positions / links, app.js
   keeps the logic.

   fr = default language. The visitor's choice is remembered
   (localStorage "lbs-lang"). The button in the top bar shows
   the current language and switches FR <-> EN.
   ============================================================ */

window.LANG = (function () {
  try {
    var saved = window.localStorage.getItem("lbs-lang");
    if (saved === "en" || saved === "fr") return saved;
  } catch (e) {}
  return "fr";
})();

window.LANGS = {

  /* ---------------- FRENCH (default) ---------------- */
  fr: {
    ui: {
      title:    "LBS — Essayage Virtuel",
      homme:    "Homme",
      femme:    "Femme",
      tops:     "Tops",
      cart:     "Panier",
      calendar: "Calendrier",
      profile:  "Profil",
      size:     "Taille",
      buy:      "Acheter",
      moreInfo: "Plus d'infos",
      back:     "Dos",
      front:    "Devant",
      seeBack:  "Voir le dos",
      seeFront: "Voir le devant",
      tryOn:    "ESSAYER",
      drag:     "GLISSER",
      prev:     "Précédent",
      next:     "Suivant",
      close:    "Fermer"
    },
    items: [
      { n: "Mini Logo — Noir",        c: "Noir",
        d: "Le basique propre de LBS. Hoodie noir oversize avec un petit logo blanc discret sur la poitrine — simple, net, il va avec tout. Capuche doublée, poche kangourou, coupe décontractée unisexe. Tailles S à XL. Paiement à la livraison partout au Maroc." },
      { n: "Machi Bhalhom — Noir",    c: "Noir",
        d: "ماشي بحالهم — pas comme eux. La calligraphie arabe blanche au centre de la poitrine dit tout, sans crier. Hoodie noir oversize, capuche doublée, poche kangourou, coupe décontractée unisexe. Tailles S à XL. Paiement à la livraison partout au Maroc." },
      { n: "Atlas Club — Beige Sable", c: "Sable",
        d: "Les montagnes de l'Atlas imprimées en grand sur la poitrine, avec l'étoile du Maroc — esprit outdoor, couleur sable facile à porter. Hoodie oversize, capuche doublée, poche kangourou, coupe décontractée unisexe. Tailles S à XL. Paiement à la livraison partout au Maroc." },
      { n: "03:17 AM — Noir Délavé",  c: "Noir délavé",
        d: "03:17 AM — everyone is asleep, I'm still becoming. Pour ceux qui travaillent pendant que le monde dort. Noir délavé effet vintage (chaque pièce est légèrement unique), texte digital blanc et petite lune sur la poitrine. Capuche doublée, poche kangourou, coupe oversize unisexe. Tailles S à XL. Paiement à la livraison partout au Maroc." },
      { n: "B9a Chwiya — Crème",      c: "Crème",
        d: "بقا شوية — encore un peu. Le verre de thé marocain sous la calligraphie : l'humour de chez nous, porté en crème doux. Hoodie oversize, capuche doublée, poche kangourou, coupe décontractée unisexe. Tailles S à XL. Paiement à la livraison partout au Maroc." },
      { n: "Still Here — Noir",       c: "Noir",
        d: "Still here. Le cœur brisé rouge qui dégouline sur le noir — pour ceux qui sont passés par des choses et qui sont toujours là. Imprimé poitrine grand, couleurs vives. Hoodie oversize, capuche doublée, poche kangourou, coupe décontractée unisexe. Tailles S à XL. Paiement à la livraison partout au Maroc." }
    ]
  },

  /* ---------------- ENGLISH ---------------- */
  en: {
    ui: {
      title:    "LBS — Virtual Try-On",
      homme:    "Men",
      femme:    "Women",
      tops:     "Tops",
      cart:     "Cart",
      calendar: "Calendar",
      profile:  "Profile",
      size:     "Size",
      buy:      "Buy",
      moreInfo: "More info",
      back:     "Back",
      front:    "Front",
      seeBack:  "See the back",
      seeFront: "See the front",
      tryOn:    "TRY ON",
      drag:     "DRAG",
      prev:     "Previous",
      next:     "Next",
      close:    "Close"
    },
    items: [
      { n: "Mini Logo — Black",        c: "Black",
        d: "The clean LBS basic. Oversize black hoodie with a small, discreet white logo on the chest — simple, sharp, goes with everything. Lined hood, kangaroo pocket, relaxed unisex fit. Sizes S to XL. Cash on delivery anywhere in Morocco." },
      { n: "Machi Bhalhom — Black",    c: "Black",
        d: "ماشي بحالهم — not like them. The white Arabic calligraphy in the middle of the chest says it all, without shouting. Oversize black hoodie, lined hood, kangaroo pocket, relaxed unisex fit. Sizes S to XL. Cash on delivery anywhere in Morocco." },
      { n: "Atlas Club — Sand Beige",  c: "Sand",
        d: "The Atlas mountains printed large on the chest, with the star of Morocco — outdoor spirit, in an easy-to-wear sand colour. Oversize hoodie, lined hood, kangaroo pocket, relaxed unisex fit. Sizes S to XL. Cash on delivery anywhere in Morocco." },
      { n: "03:17 AM — Washed Black",  c: "Washed black",
        d: "03:17 AM — everyone is asleep, I'm still becoming. For the ones who work while the world sleeps. Vintage washed black (every piece is slightly unique), white digital text and a small moon on the chest. Lined hood, kangaroo pocket, oversize unisex fit. Sizes S to XL. Cash on delivery anywhere in Morocco." },
      { n: "B9a Chwiya — Cream",       c: "Cream",
        d: "بقا شوية — just a little more. The Moroccan tea glass under the calligraphy: our own humour, worn in soft cream. Oversize hoodie, lined hood, kangaroo pocket, relaxed unisex fit. Sizes S to XL. Cash on delivery anywhere in Morocco." },
      { n: "Still Here — Black",       c: "Black",
        d: "Still here. The dripping red broken heart on black — for those who went through things and are still standing. Large chest print, vivid colours. Oversize hoodie, lined hood, kangaroo pocket, relaxed unisex fit. Sizes S to XL. Cash on delivery anywhere in Morocco." }
    ]
  }
};
