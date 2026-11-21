/* ============================================================
   LBS 2D — ALL LANGUAGES IN ONE FILE
   ------------------------------------------------------------
   Every word the page shows lives here: French, English, Arabic.
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
    if (saved === "en" || saved === "fr" || saved === "ar") return saved;
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
            close:    "Fermer",
      addToCart: "Ajouter",
      retour:   "Retour",
      cartTitle: "Votre panier",
      emptyCart: "Votre portant est vide",
      emptyHint: "Les hoodies que vous ajoutez apparaissent ici, accrochés au portant.",
      discover: "Voir les hoodies",
      total:    "Total",
      checkout: "Commander",
      deliveryFree: "Livraison gratuite · Paiement à la livraison",
      qty:      "Qté",
      remove:   "Retirer",
      formTitle: "Livraison",
      fName:    "Nom complet",
      fPhone:   "Téléphone",
      fCity:    "Ville",
      fAddress: "Adresse",
      confirm:  "Confirmer la commande",
      addedMsg: "Ajouté ✓",
      marquee:  "LBS • PAIEMENT À LA LIVRAISON • LIVRAISON PARTOUT AU MAROC • "
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
            close:    "Close",
      addToCart: "Add",
      retour:   "Back",
      cartTitle: "Your cart",
      emptyCart: "Your rail is empty",
      emptyHint: "The hoodies you add will hang here, on the rail.",
      discover: "Browse hoodies",
      total:    "Total",
      checkout: "Checkout",
      deliveryFree: "Free delivery · Cash on delivery",
      qty:      "Qty",
      remove:   "Remove",
      formTitle: "Delivery",
      fName:    "Full name",
      fPhone:   "Phone",
      fCity:    "City",
      fAddress: "Address",
      confirm:  "Confirm order",
      addedMsg: "Added ✓",
      marquee:  "LBS • CASH ON DELIVERY • FREE DELIVERY ACROSS MOROCCO • "
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
,
  /* ---------------- ARABIC ---------------- */
  ar: {
    ui: {
      title:    "LBS — القياس الافتراضي",
      homme:    "رجالي",
      femme:    "نسائي",
      tops:     "العلويات",
      cart:     "السلة",
      calendar: "التقويم",
      profile:  "الحساب",
      size:     "المقاس",
      buy:      "اشتري",
      moreInfo: "المزيد",
      back:     "الظهر",
      front:    "الأمام",
      seeBack:  "شاهد الظهر",
      seeFront: "شاهد الأمام",
      tryOn:    "جرّب",
      drag:     "اسحب",
      prev:     "السابق",
      next:     "التالي",
            close:    "إغلاق",
      addToCart: "أضف",
      retour:   "رجوع",
      cartTitle: "سلة التسوق",
      emptyCart: "العلّاقة فارغة",
      emptyHint: "الهوديز التي تضيفها ستظهر هنا، معلّقة على العلّاقة.",
      discover: "تصفح الهوديز",
      total:    "المجموع",
      checkout: "اطلب الآن",
      deliveryFree: "توصيل مجاني · الدفع عند الاستلام",
      qty:      "الكمية",
      remove:   "إزالة",
      formTitle: "التوصيل",
      fName:    "الاسم الكامل",
      fPhone:   "الهاتف",
      fCity:    "المدينة",
      fAddress: "العنوان",
      confirm:  "تأكيد الطلب",
      addedMsg: "أُضيف ✓",
      marquee:  "LBS • الدفع عند الاستلام • توصيل مجاني في كل المغرب • "
    },
    items: [
      { n: "Mini Logo — أسود",        c: "أسود",
        d: "القطعة الأساسية النظيفة من LBS. هودي أسود أوفرسايز مع شعار أبيض صغير وخفيف على الصدر — بسيط وأنيق ويمشي مع كل شيء. غطاء رأس مبطّن، جيب كنغر، قصة مريحة للجنسين. المقاسات من S إلى XL. الدفع عند الاستلام في جميع أنحاء المغرب." },
      { n: "ماشي بحالهم — أسود",    c: "أسود",
        d: "ماشي بحالهم — لست مثلهم. الخط العربي الأبيض في وسط الصدر يقول كل شيء، دون أن يصرخ. هودي أسود أوفرسايز، غطاء رأس مبطّن، جيب كنغر، قصة مريحة للجنسين. المقاسات من S إلى XL. الدفع عند الاستلام في جميع أنحاء المغرب." },
      { n: "Atlas Club — بيج رملي",  c: "رملي",
        d: "جبال الأطلس مطبوعة بحجم كبير على الصدر، مع نجمة المغرب — روح المغامرة، بلون رملي سهل اللبس. هودي أوفرسايز، غطاء رأس مبطّن، جيب كنغر، قصة مريحة للجنسين. المقاسات من S إلى XL. الدفع عند الاستلام في جميع أنحاء المغرب." },
      { n: "03:17 AM — أسود باهت",  c: "أسود باهت",
        d: "03:17 AM — الجميع نائم، وأنا ما زلت أصنع نفسي. لمن يعمل بينما العالم نائم. أسود باهت بتأثير فينتاج (كل قطعة فريدة قليلاً)، نص رقمي أبيض وقمر صغير على الصدر. غطاء رأس مبطّن، جيب كنغر، قصة أوفرسايز للجنسين. المقاسات من S إلى XL. الدفع عند الاستلام في جميع أنحاء المغرب." },
      { n: "بقا شوية — كريمي",      c: "كريمي",
        d: "بقا شوية — ما زال قليل. كأس الشاي المغربي تحت الخط العربي: فكاهتنا الخاصة، ملبوسة بلون كريمي ناعم. هودي أوفرسايز، غطاء رأس مبطّن، جيب كنغر، قصة مريحة للجنسين. المقاسات من S إلى XL. الدفع عند الاستلام في جميع أنحاء المغرب." },
      { n: "Still Here — أسود",       c: "أسود",
        d: "ما زلت هنا. القلب الأحمر المكسور الذي يقطر على الأسود — لمن مرّوا بأوقات صعبة وما زالوا واقفين. طبعة صدر كبيرة وألوان زاهية. هودي أوفرسايز، غطاء رأس مبطّن، جيب كنغر، قصة مريحة للجنسين. المقاسات من S إلى XL. الدفع عند الاستلام في جميع أنحاء المغرب." }
    ]
  }
};
