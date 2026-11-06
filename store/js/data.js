/* ============================================================
   VirtualFit — catalogue data, organised BY CATEGORY
   ------------------------------------------------------------
   Each category is separate and self-contained (Omar's rule):
   its own model sheet (the character wearing its items), its
   own garment sheet, and its own items. The tab bar switches
   category; the app rebuilds the arc from the active one.

   A category:
     id       short id
     label    tab label (must match the tab text in index.html)
     model    the character sheet for this category:
       img      background-image value for the sheet
       size     background-size that frames one figure window
       aspect   figure-window aspect ratio ("w/h")
       height / heightPhone   model height on desktop / phone
                (null = the CSS default, used by Tops)
       lift / liftPhone       model bottom offset (null = 0)
     garment  the ghost-mannequin sheet for this category:
       img, size   same idea, for the product crops
     items    the garments (see fields below)

   An item:
     n    name shown on the card and in the buy card
     p    price in dollars (shown as $p)
     g    [x%, y%] background-position of this garment inside
          the category's garment sheet (see CHARACTER.md)
     m    background-position-x % of this garment's figure
          inside the category's model sheet (see CHARACTER.md)
     c    colour options as [name, hex] pairs (4 per item);
          the first one is selected by default
     img  OPTIONAL. A standalone picture file for this garment
          (e.g. "assets/my-tshirt.png"). When present, the arc
          card and the buy-card thumbnail show that picture
          instead of the garment-sheet crop. `g` is then not
          needed; `m` is still used for the on-model figure,
          so the category's model sheet needs a figure wearing
          this garment (see CHARACTER.md / README.md).
   ============================================================ */

window.CATEGORIES = [
  {
    id: "tops",
    label: "Tops",
    model: {
      img: "var(--model)",            /* sheet URL is the --model variable in css/style.css */
      size: "513% 111.76%",           /* 2688x1520 sheet, 524x1360 figure window */
      aspect: "524/1360",
      height: null, heightPhone: null,
      lift: null, liftPhone: null
    },
    garment: {
      img: "var(--garm)",             /* sheet URL is the --garm variable in css/style.css */
      size: "320% 212.5%"             /* 2048x1360 sheet, 640x640 cells */
    },
    items: [
      {n:"Basic T-shirt", p:45,  g:[1.14,3.06],  m:.37,   c:[["White","#f4f2ee"],["Ash","#c9c7c2"],["Charcoal","#3b3c3f"],["Navy","#27324d"]]},
      {n:"Basic Sweater", p:105, g:[49.7,1.39],  m:25.0,  c:[["White","#f6f4ef"],["Oat","#ddd3c2"],["Sage","#b9c2ae"],["Black","#1f1f21"]]},
      {n:"Linen Shirt",   p:95,  g:[98.2,3.33],  m:49.86, c:[["White","#f7f6f1"],["Sand","#d9ccb4"],["Sky","#bcd0e2"],["Olive","#717556"]]},
      {n:"Grey Hoodie",   p:110, g:[1.14,93.3],  m:74.77, c:[["Heather","#a9a9a8"],["Bone","#e6e1d6"],["Forest","#33463a"],["Black","#1f1f21"]]},
      {n:"Ringer Tee",    p:55,  g:[49.7,95.3],  m:99.35, c:[["White / Black","#f4f2ee"],["Cream / Navy","#efe6d3"],["Grey / Red","#c9c7c2"],["White / Green","#e9efe8"]]},
    ]
  },
  {
    id: "bottoms",
    label: "Bottoms",
    model: {
      img: 'url("assets/model-bottoms.webp")',
      size: "751.52% 100%",           /* 2480x972 sheet, 330x972 figure window (measured, see CHARACTER.md) */
      aspect: "330/972",
      height: "min(84vh,96vw)", heightPhone: "min(72vh,150vw)",
      lift: "6vh", liftPhone: "10vh"
    },
    garment: {
      img: 'url("assets/garments-bottoms.webp")',
      size: "311.69% 207.79%"         /* 1920x1280 sheet, 616x616 windows (measured) */
    },
    items: [
      {n:"Charcoal Trousers", p:65, g:[5.44,5.95],   m:3.88,  c:[["Charcoal","#3b3c3f"],["Black","#1f1f21"],["Navy","#27324d"],["Stone","#b8b0a0"]]},
      {n:"Blue Jeans",        p:70, g:[49.65,5.95],  m:27.21, c:[["Indigo","#33507e"],["Washed","#7d9bbd"],["Black","#232326"],["Stone","#c9c2b2"]]},
      {n:"Beige Chinos",      p:60, g:[93.75,6.4],   m:50.12, c:[["Beige","#ddd3c2"],["Khaki","#b3a284"],["Olive","#717556"],["Navy","#27324d"]]},
      {n:"Black Joggers",     p:55, g:[19.02,97.44], m:73.0,  c:[["Black","#1f1f21"],["Charcoal","#3b3c3f"],["Heather","#a9a9a8"],["Navy","#27324d"]]},
      {n:"Navy Shorts",       p:40, img:"assets/item-navy-shorts.webp", m:95.79, c:[["Navy","#27324d"],["Khaki","#b3a284"],["Black","#1f1f21"],["Stone","#c9c2b2"]]},
    ]
  },
  {
    id: "shoes",
    label: "Shoes",
    model: {
      img: 'url("assets/model-shoes.webp")',
      size: "539.76% 100%",           /* 2240x1072 sheet, 415x1072 figure window (measured, see CHARACTER.md) */
      aspect: "415/1072",
      height: "min(58vh,110vw)", heightPhone: "min(48vh,110vw)",
      lift: "16vh", liftPhone: "25vh"
    },
    garment: {
      img: 'url("assets/garments-shoes.webp")',
      size: "273.89% 182.6%"          /* 1920x1280 sheet, 701x701 windows (measured) */
    },
    items: [
      {n:"White Sneakers",    p:85,  img:"assets/item-white-sneakers.webp", m:1.75,  c:[["White","#f4f2ee"],["Bone","#e6e1d6"],["Grey","#c9c7c2"],["Black","#1f1f21"]]},
      {n:"Black Leather Shoes", p:120, img:"assets/item-black-leather.webp", m:25.86, c:[["Black","#1f1f21"],["Espresso","#3a2a20"],["Oxblood","#5a2320"],["Tan","#b98a5a"]]},
      {n:"Brown Boots",       p:130, img:"assets/item-brown-boots.webp",    m:49.73, c:[["Brown","#6e4a2f"],["Tan","#b98a5a"],["Black","#1f1f21"],["Sand","#d9ccb4"]]},
      {n:"Grey Runners",      p:95,  g:[18.13,100],   m:73.89, c:[["Grey","#a9a9a8"],["White","#f4f2ee"],["Black","#1f1f21"],["Navy","#27324d"]]},
      {n:"Tan Loafers",       p:110, g:[82.32,100],   m:98.0,  c:[["Tan","#b98a5a"],["Brown","#6e4a2f"],["Suede Sand","#d9ccb4"],["Black","#1f1f21"]]},
    ]
  },
];

/* Backwards-compatible alias: the original tops-only list. */
window.ITEMS = window.CATEGORIES[0].items;

/* ------------------------------------------------------------
   TEMPLATE — adding a garment / category: see README.md
   ("Project structure & future steps"). In short: garments
   go into the `items` array of their category above; a new
   category is a new object in CATEGORIES with its own two
   sheets (CHARACTER.md explains how the sheets are made and
   how the crop numbers are measured).
   ------------------------------------------------------------ */
