/* ============================================================
   VirtualFit — garment data
   ------------------------------------------------------------
   Every garment in the store is ONE entry in ITEMS below.
   The app builds two copies of every item as arc cards, so
   the arc loops seamlessly.

   Fields:
     n    name shown on the card and in the buy card
     p    price in dollars (shown as $p)
     g    [x%, y%] background-position of this garment inside
          the garment sheet (see CHARACTER.md) — sheet crops
     m    background-position-x % of this garment's figure
          inside the model sheet (see CHARACTER.md)
     c    colour options as [name, hex] pairs (4 per item);
          the first one is selected by default
     img  OPTIONAL. A standalone picture file for this garment
          (e.g. "assets/my-tshirt.png"). When present, the arc
          card and the buy-card thumbnail show that picture
          instead of the garment-sheet crop. `g` is then not
          needed; `m` is still used for the on-model figure,
          so the model sheet needs a figure wearing this
          garment (see CHARACTER.md / README.md).
   ============================================================ */

window.ITEMS = [
  {n:"Basic T-shirt", p:45,  g:[1.14,3.06],  m:.37,   c:[["White","#f4f2ee"],["Ash","#c9c7c2"],["Charcoal","#3b3c3f"],["Navy","#27324d"]]},
  {n:"Basic Sweater", p:105, g:[49.7,1.39],  m:25.0,  c:[["White","#f6f4ef"],["Oat","#ddd3c2"],["Sage","#b9c2ae"],["Black","#1f1f21"]]},
  {n:"Linen Shirt",   p:95,  g:[98.2,3.33],  m:49.86, c:[["White","#f7f6f1"],["Sand","#d9ccb4"],["Sky","#bcd0e2"],["Olive","#717556"]]},
  {n:"Grey Hoodie",   p:110, g:[1.14,93.3],  m:74.77, c:[["Heather","#a9a9a8"],["Bone","#e6e1d6"],["Forest","#33463a"],["Black","#1f1f21"]]},
  {n:"Ringer Tee",    p:55,  g:[49.7,95.3],  m:99.35, c:[["White / Black","#f4f2ee"],["Cream / Navy","#efe6d3"],["Grey / Red","#c9c7c2"],["White / Green","#e9efe8"]]},
];

/* ------------------------------------------------------------
   TEMPLATE — to add a new garment, copy one of these entries
   into the ITEMS array above (don't forget the comma).

   A) Classic sheet item (garment photo added to the two
      sheets first — see CHARACTER.md):

  ,{n:"New T-shirt", p:60, g:[0,0], m:0, c:[["White","#f4f2ee"],["Black","#1f1f21"],["Sand","#d9ccb4"],["Navy","#27324d"]]}

   B) Standalone photo item (quickest — just one picture):

  1. Drop the photo into the assets/ folder
     (transparent PNG or WebP looks best, square-ish).
  2. Add an entry like this:

  ,{n:"New T-shirt", p:60, img:"assets/new-tshirt.png", m:0, c:[["White","#f4f2ee"],["Black","#1f1f21"],["Sand","#d9ccb4"],["Navy","#27324d"]]}

     `m` still points at the on-model figure in the model
     sheet — until a figure wearing the new garment exists
     there (CHARACTER.md explains how to make one), point
     `m` at the closest-looking figure so the try-on scan
     has something to reveal.
   ------------------------------------------------------------ */
