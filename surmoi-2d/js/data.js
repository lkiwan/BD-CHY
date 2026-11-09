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
     img  standalone picture of the garment, shown on the arc
          card and the buy-card thumbnail
   ============================================================ */

window.ITEMS = [
  {n:"Logo Hoodie",         p:110, m:0,   img:"assets/garment-01.jpg", c:[["Black","#1f1f21"]]},
  {n:"Machi Bhalhom Hoodie", p:110, m:20,  img:"assets/garment-02.jpg", c:[["Black","#1f1f21"]]},
  {n:"Atlas Club Hoodie",    p:110, m:40,  img:"assets/garment-03.jpg", c:[["Sand","#d9ccb4"]]},
  {n:"03:17 AM Hoodie",      p:110, m:60,  img:"assets/garment-04.jpg", c:[["Washed Black","#3a3a3c"]]},
  {n:"B9a Chwiya Hoodie",    p:110, m:80,  img:"assets/garment-05.jpg", c:[["Cream","#efe6d3"]]},
  {n:"Still Here Hoodie",    p:110, m:100, img:"assets/garment-06.jpg", c:[["Black","#1f1f21"]]},
];
