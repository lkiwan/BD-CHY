/* ============================================================
   SURMOI 2D — garment data
   ------------------------------------------------------------
   Every garment in the store is ONE entry in ITEMS below.
   The app builds two copies of every item as arc cards, so
   the arc loops seamlessly.

   Fields:
     n    name shown on the card and in the buy card
     p    price in dollars (shown as $p)
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
  {n:"Logo Hoodie",         p:110, m:0,   g:[1.5,2.8],  c:[["Black","#1f1f21"]]},
  {n:"Machi Bhalhom Hoodie", p:110, m:20,  g:[50,2.8],   c:[["Black","#1f1f21"]]},
  {n:"Atlas Club Hoodie",    p:110, m:40,  g:[98.5,2.8], c:[["Sand","#d9ccb4"]]},
  {n:"03:17 AM Hoodie",      p:110, m:60,  g:[1.5,97.2], c:[["Washed Black","#3a3a3c"]]},
  {n:"B9a Chwiya Hoodie",    p:110, m:80,  g:[50,97.2],  c:[["Cream","#efe6d3"]]},
  {n:"Still Here Hoodie",    p:110, m:100, g:[98.5,97.2],c:[["Black","#1f1f21"]]},
];
