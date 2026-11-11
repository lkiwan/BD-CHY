/* ============================================================
   SURMOI 2D — garment data
   ------------------------------------------------------------
   Every garment in the store is ONE entry in ITEMS below.
   The app builds two copies of every item as arc cards, so
   the arc loops seamlessly.

   Fields:
     n    name shown on the card and in the buy card
     p    price in MAD (shown as "p MAD")
     u    this hoodie product page on YouCan (the Buy button opens it)
     d    full description, shown by the More info button
     m    background-position-x % of this garment's figure
          inside the model sheet (assets/model-sheet-6.webp —
          6 figures side by side, so m steps 0/20/40/60/80/100)
     c    colour options as [name, hex] pairs;
          the first one is selected by default
     g    [x, y] background-position % of this garment inside
          the garment sheet (assets/garment-sheet.webp —
          3 across x 2 down, garments centred in their cells)
   ============================================================ */

window.ITEMS = [
  {n:"Mini Logo — Noir", p:200, m:0, g:[1.5,2.8], c:[["Black","#1f1f21"]], u:"https://yovishop.youcan.store/products/hoodie-mini-logo-noir", d:"Le basique propre de SURMOI. Hoodie noir oversize avec un petit logo blanc discret sur la poitrine \u2014 simple, net, il va avec tout. Capuche doubl\u00e9e, poche kangourou, coupe d\u00e9contract\u00e9e unisexe. Tailles S \u00e0 XL. Paiement \u00e0 la livraison partout au Maroc."},
  {n:"Machi Bhalhom — Noir", p:200, m:20, g:[50,2.8], c:[["Black","#1f1f21"]], u:"https://yovishop.youcan.store/products/hoodie-machi-bhalhom-noir", d:"\u0645\u0627\u0634\u064a \u0628\u062d\u0627\u0644\u0647\u0645 \u2014 pas comme eux. La calligraphie arabe blanche au centre de la poitrine dit tout, sans crier. Hoodie noir oversize, capuche doubl\u00e9e, poche kangourou, coupe d\u00e9contract\u00e9e unisexe. Tailles S \u00e0 XL. Paiement \u00e0 la livraison partout au Maroc."},
  {n:"Atlas Club — Beige Sable", p:200, m:40, g:[98.5,2.8], c:[["Sand","#d9ccb4"]], u:"https://yovishop.youcan.store/products/hoodie-atlas-club-beige-sable", d:"Les montagnes de l'Atlas imprim\u00e9es en grand sur la poitrine, avec l'\u00e9toile du Maroc \u2014 esprit outdoor, couleur sable facile \u00e0 porter. Hoodie oversize, capuche doubl\u00e9e, poche kangourou, coupe d\u00e9contract\u00e9e unisexe. Tailles S \u00e0 XL. Paiement \u00e0 la livraison partout au Maroc."},
  {n:"03:17 AM — Noir Délavé", p:200, m:60, g:[1.5,97.2], c:[["Washed Black","#3a3a3c"]], u:"https://yovishop.youcan.store/products/hoodie-0317-am-noir-delave", d:"03:17 AM \u2014 everyone is asleep, I'm still becoming. Pour ceux qui travaillent pendant que le monde dort. Noir d\u00e9lav\u00e9 effet vintage (chaque pi\u00e8ce est l\u00e9g\u00e8rement unique), texte digital blanc et petite lune sur la poitrine. Capuche doubl\u00e9e, poche kangourou, coupe oversize unisexe. Tailles S \u00e0 XL. Paiement \u00e0 la livraison partout au Maroc."},
  {n:"B9a Chwiya — Crème", p:200, m:80, g:[50,97.2], c:[["Cream","#efe6d3"]], u:"https://yovishop.youcan.store/products/hoodie-b9a-chwiya-bka-shoy-creme", d:"\u0628\u0642\u0627 \u0634\u0648\u064a\u0629 \u2014 encore un peu. Le verre de th\u00e9 marocain sous la calligraphie : l'humour de chez nous, port\u00e9 en cr\u00e8me doux. Hoodie oversize, capuche doubl\u00e9e, poche kangourou, coupe d\u00e9contract\u00e9e unisexe. Tailles S \u00e0 XL. Paiement \u00e0 la livraison partout au Maroc."},
  {n:"Still Here — Noir", p:200, m:100, g:[98.5,97.2], c:[["Black","#1f1f21"]], u:"https://yovishop.youcan.store/products/hoodie-still-here-noir", d:"Still here. Le c\u0153ur bris\u00e9 rouge qui d\u00e9gouline sur le noir \u2014 pour ceux qui sont pass\u00e9s par des choses et qui sont toujours l\u00e0. Imprim\u00e9 poitrine grand, couleurs vives. Hoodie oversize, capuche doubl\u00e9e, poche kangourou, coupe d\u00e9contract\u00e9e unisexe. Tailles S \u00e0 XL. Paiement \u00e0 la livraison partout au Maroc."},
];
