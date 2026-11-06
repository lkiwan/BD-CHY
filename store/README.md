# VirtualFit — virtual try-on clothing store

A single-screen, visionOS-style try-on page: garment cards float in a 3D arc
around a model; when the arc settles on a garment, a scan line sweeps down the
model and reveals him wearing it. Built to sell clothes — and to keep growing:
adding a garment is one picture + one data entry (see below).

Live in this repo on GitHub Pages at `/store/` (same site as the other
BD-CHY projects).

## How it is organized

```
store/
├── index.html        Markup only — layers, tab bar, rail, buy card, cursor.
├── css/
│   └── style.css     ALL styling. The three image sheets are the CSS
│                     variables --room / --model / --garm at the top.
├── js/
│   ├── data.js       The catalogue: window.ITEMS — one entry per garment.
│   └── app.js        ALL logic: arc maths, try-on scan, buy card, inputs.
├── assets/           Future garment photos go here (see "Adding a garment").
├── CHARACTER.md      How the model character and his sheets were created,
│                     and how to recreate the same for another person.
└── README.md         This file.
```

Plain HTML + CSS + vanilla JS. No libraries, no build step — edit a file and
push; GitHub Pages serves it as-is.

## Adding a garment

### Quick way — one standalone photo

1. Drop the garment photo into `assets/`
   (transparent PNG/WebP works best; square-ish framing).
2. Open `js/data.js` and add ONE entry to `ITEMS` (template B at the bottom
   of that file):

   ```js
   ,{n:"New T-shirt", p:60, img:"assets/new-tshirt.png", m:0,
     c:[["White","#f4f2ee"],["Black","#1f1f21"],["Sand","#d9ccb4"],["Navy","#27324d"]]}
   ```

   - `n` = name, `p` = price in dollars, `c` = the 4 colour options.
   - `img` makes the arc card and the buy-card thumbnail show your photo.
3. The try-on figure: `m` positions the figure the scan reveals on the
   model. Until a figure wearing the new garment exists in the model sheet,
   point `m` at the closest-looking existing figure (`0`, `25`, `49.86`,
   `74.77`, `99.35` are the five current positions). To do it properly —
   a figure actually wearing the new garment — follow **CHARACTER.md**.

### Full way — real sheet garment

Add the garment's ghost-mannequin shot to the garment sheet and a figure
wearing it to the model sheet (both sheets and their crop maths are
documented in **CHARACTER.md**), then add the entry with `g` (sheet
position) and `m` (figure position) instead of `img`.

### Notes

- The arc auto-adapts: the app builds two copies of every `ITEMS` entry as
  cards, so the arc always loops seamlessly, whatever the catalogue size.
- Name, price, colours — everything a shopper sees comes from the one entry.
- Prices are plain dollars (`$` + `p`). Sizes S/M/L/XL are fixed in
  `index.html` (buy card).

## The character

The man in the middle is a personal character. **CHARACTER.md** documents
exactly how he and his two image sheets were made, so the same character can
be recreated for another person: same sheet sizes, same framing, same crop
maths — then swap `--model` (and `--garm`) in `css/style.css`.
