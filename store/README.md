# VirtualFit — virtual try-on clothing store

A single-screen, visionOS-style try-on page: garment cards float in a 3D arc
around a model; when the arc settles on a garment, a scan line sweeps down
the model and reveals him wearing it. The tab bar switches **category**
(Tops / Bottoms / Shoes are live; Outerwear / Accessories are reserved).
The model can be **zoomed** (the +/− glass buttons at bottom-right,
double-click / double-tap on the model, or pinch) to inspect the fit.

Built to sell clothes — and to keep growing **step by step**: every category
is separate and self-contained (its own character sheet, garment sheet and
items), so future additions plug in without touching the existing ones.
This file is the map for that: if you only read one document, read this one.

Live in this repo on GitHub Pages at `/store/` (same site as the other
BD-CHY projects).

## Project structure & future steps

### Folder map

```
store/
├── index.html        Markup only — layers, tab bar, rail, model, buy card,
│                     zoom buttons, cursor.
├── css/
│   └── style.css     ALL styling. The Tops sheets and the room are the CSS
│                     variables --room / --model / --garm at the top; the
│                     Bottoms/Shoes sheets are local files (see assets/).
├── js/
│   ├── data.js       The catalogue: window.CATEGORIES — one object per
│   │                 category, its sheets + its items (see below).
│   └── app.js        ALL logic: arc maths, try-on scan, buy card, tabs =
│                     category switching, model zoom, inputs.
├── assets/           Local sheet files for the newer categories:
│   ├── model-bottoms.webp     Character sheet — Bottoms (full body ×5)
│   ├── garments-bottoms.webp  Ghost-mannequin sheet — Bottoms (5 pants)
│   ├── model-shoes.webp       Character sheet — Shoes (legs ×5)
│   └── garments-shoes.webp    Product sheet — Shoes (5 pairs)
│                     Future garment photos also go here.
├── CHARACTER.md      How the model character and every sheet were made,
│                     with all the measured crop numbers, and how to
│                     recreate the same for another person.
└── README.md         This file.
```

Plain HTML + CSS + vanilla JS. No libraries, no build step — edit a file
and push; GitHub Pages serves it as-is.

### Where each category lives

| Category | Character sheet | Garment sheet | Data |
|---|---|---|---|
| Tops | `--model` URL in css/style.css (remote) | `--garm` URL in css/style.css (remote) | `CATEGORIES[0]` in js/data.js |
| Bottoms | `assets/model-bottoms.webp` | `assets/garments-bottoms.webp` | `CATEGORIES[1]` in js/data.js |
| Shoes | `assets/model-shoes.webp` | `assets/garments-shoes.webp` | `CATEGORIES[2]` in js/data.js |

A category object in `js/data.js` holds everything the app needs:
`model {img, size, aspect, height, lift}` (the character sheet + how the
figure window is cut and how tall the model stands), `garment {img, size}`
(the product sheet), and `items` — each item is
`{n, p, g:[x%,y%], m, c:[[name,hex]×4]}` (name, price, garment crop,
figure crop, colours), or `{n, p, img:"assets/…", m, c}` for a standalone
photo. `CHARACTER.md` documents how every sheet was produced and how its
crop numbers were measured — the sheets all follow the same method as the
original Tops sheets.

### Recipe (a) — add a new garment to an existing category

1. **Picture**: add the garment's ghost-mannequin shot to the category's
   garment sheet and a figure wearing it to the category's model sheet
   (the sheet method + measuring recipe are in CHARACTER.md).
   *Quick alternative:* one standalone transparent photo in `assets/`.
2. **Data**: add ONE entry to that category's `items` in `js/data.js` —
   sheet version: `{n, p, g:[…], m, c:[…]}` with the measured crops;
   photo version: `{n, p, img:"assets/…", m, c:[…]}` (point `m` at the
   closest existing figure until a real figure exists).
3. Nothing else. The arc builds two copies of every item and loops,
   whatever the catalogue size; the buy card, colours and scan all read
   from the same entry.

### Recipe (b) — add a new category (e.g. Outerwear)

1. **Sheets**: make the category's two sheets exactly like the others
   (CHARACTER.md): a character sheet — the same man, once per item,
   side by side on a transparent background — and a garment sheet.
   Save them in `assets/` (WebP, e.g. `assets/model-outerwear.webp`,
   `assets/garments-outerwear.webp`) and measure the crops.
2. **Tab**: the tab already exists in `index.html` — its label must match
   the category's `label` in data.js ("Outerwear" / "Accessories" are
   already there; until a category exists behind them they just spin
   the arc one full lap, the original behaviour).
3. **Data**: append one object to `window.CATEGORIES` in `js/data.js`
   (copy an existing category and swap in the new sheets, sizes, model
   height/lift and items). The app picks it up automatically — tab
   switching, arc, scan, zoom all work per category.

### Recipe (c) — add a new character (another person)

1. Follow **CHARACTER.md** ("Recreating the character for another
   person") to produce that person's sheets — same method, same
   framing discipline, per category you want them to model.
2. Point the category's `model.img` in `js/data.js` at the new sheet
   (and update `model.size` / `aspect` if the sheet's window differs),
   or swap `--model` in `css/style.css` for Tops.
3. Re-measure the per-item `m` values from the new sheet (formula in
   CHARACTER.md) and update the items.

### Notes

- Prices are plain dollars (`$` + `p`). Sizes S/M/L/XL are fixed chips in
  `index.html` (buy card), shared by all categories.
- Zoom: 1×–2.5×, resets to 1× whenever the outfit or the category
  changes; while zoomed, dragging on the model pans it (a drag that
  starts elsewhere still drives the arc).
- `window.ITEMS` in data.js is a backwards-compatible alias of the Tops
  items; new code should use `window.CATEGORIES`.
