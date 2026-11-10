/* ============================================================
   SURMOI 2D — garment data
   ------------------------------------------------------------
   Every garment in the store is ONE entry in ITEMS below.
   The app builds two copies of every item as arc cards, so
   the arc loops seamlessly.

   Fields:
     n    name shown on the card and in the buy card
     p    price in MAD (shown as "p MAD")
     u    this hoodie product page on YouCan (Commander button opens it)
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
  {n:"Hoodie « Mini Logo » — Noir", p:200, m:0, g:[1.5,2.8], c:[["Black","#1f1f21"]], u:"https://yovishop.youcan.store/products/hoodie-mini-logo-noir"},
  {n:"Hoodie « Machi Bhalhom » — ماشي بحالهم — Noir", p:200, m:20, g:[50,2.8], c:[["Black","#1f1f21"]], u:"https://yovishop.youcan.store/products/hoodie-machi-bhalhom-noir"},
  {n:"Hoodie « Atlas Club » — Beige Sable", p:200, m:40, g:[98.5,2.8], c:[["Sand","#d9ccb4"]], u:"https://yovishop.youcan.store/products/hoodie-atlas-club-beige-sable"},
  {n:"Hoodie « 03:17 AM » — Noir Délavé", p:200, m:60, g:[1.5,97.2], c:[["Washed Black","#3a3a3c"]], u:"https://yovishop.youcan.store/products/hoodie-0317-am-noir-delave"},
  {n:"Hoodie « B9a Chwiya » — بقا شوية — Crème", p:200, m:80, g:[50,97.2], c:[["Cream","#efe6d3"]], u:"https://yovishop.youcan.store/products/hoodie-b9a-chwiya-bka-shoy-creme"},
  {n:"Hoodie « Still Here » — Noir", p:200, m:100, g:[98.5,97.2], c:[["Black","#1f1f21"]], u:"https://yovishop.youcan.store/products/hoodie-still-here-noir"},
];
