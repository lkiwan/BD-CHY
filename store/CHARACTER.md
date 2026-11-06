# The character — how he was created

VirtualFit's model is **one specific man**, and the try-on works from two
transparent image sheets made of him. This file records exactly how those
sheets were built, so the same character can be recreated — for him again,
or for another person — and keep working with the same code.

## The man

- Short dark hair, trimmed beard.
- Wearing charcoal trousers in every shot (only the top changes).
- Same pose, same framing, same lighting in every figure:
  standing straight, facing the camera, shot from **head to mid-thigh**
  (the page crops him at mid-thigh; the buy card sits over the rest).

## Sheet 1 — the model sheet (`--model` in css/style.css)

- **One transparent PNG, 2688 × 1520 px.**
- The **same man five times, side by side** in a single row — once per
  garment, in catalogue order:
  1. white crew-neck t-shirt
  2. oversized white sweatshirt
  3. white linen shirt
  4. heather-grey hoodie
  5. white ringer tee with black trims
- Each figure occupies a **524 × 1360 window** of the sheet.

How the page cuts a figure out (css/style.css → `.model .fig`):

```css
background-image: var(--model);
background-size: 513% 111.76%;   /* 2688/524 wide, 1520/1360 tall */
background-position: <m>% 100%;  /* y is always 100% — figures sit on
                                    the sheet's bottom edge */
```

`<m>` is stored per garment in `js/data.js` (field `m`):

| Garment        | m (%) |
|----------------|-------|
| Basic T-shirt  | 0.37  |
| Basic Sweater  | 25.0  |
| Linen Shirt    | 49.86 |
| Grey Hoodie    | 74.77 |
| Ringer Tee     | 99.35 |

(Background-position % rule: `m = figureLeft / (sheetWidth − windowWidth) × 100`.
The figures are not on a perfectly even grid — the values above were read
off the finished sheet so each figure centres in its window.)

## Sheet 2 — the garment sheet (`--garm` in css/style.css)

- **One transparent PNG, 2048 × 1360 px.**
- **Ghost-mannequin** product shots (the garment alone, as if worn by an
  invisible man) in a **3 × 2 grid**; each cell is a **640 × 640 box**:
  - Top row: white tee · white sweatshirt · white linen shirt
  - Bottom row: grey hoodie · ringer tee · navy tee *(the navy tee is
    photographed but unused by the current catalogue)*
- The room (`--room`) is a separate bright Scandinavian living-room photo,
  16:9 — it is set dressing only, any blurred interior works.

How the page cuts a garment out (css/style.css → `.card .g`, `.buy .thumbG`):

```css
background-image: var(--garm);
background-size: 320% 212.5%;    /* 2048/640 wide, 1360/640 tall */
background-position: <g[0]>% <g[1]>%;   /* per garment, field `g` in data.js */
```

Current `g` values: tee `[1.14, 3.06]` · sweater `[49.7, 1.39]` ·
linen shirt `[98.2, 3.33]` · hoodie `[1.14, 93.3]` · ringer tee `[49.7, 95.3]`.

## Recreating the character for another person

1. **Photograph / generate the person once per garment** — same pose,
   same camera distance, same light every time; head to mid-thigh in
   frame; the same trousers throughout; transparent background
   (or cut out cleanly).
2. **Assemble the model sheet**: one transparent image, **2688 × 1520**,
   the five figures side by side at the same scale, feet/bottom edge
   aligned on the sheet's bottom edge, each figure inside a
   **524 × 1360** window.
3. **Photograph / generate the garments alone** (ghost-mannequin style),
   transparent background, and assemble the garment sheet:
   **2048 × 1360**, 3 × 2 grid of **640 × 640** cells.
4. **Swap the URLs**: replace `--model` and `--garm` at the top of
   `css/style.css` with the new sheets (hosted URLs, or local files —
   e.g. `--model:url("../assets/model-sheet.png")`).
5. **Read off the crops**: for each garment, compute `m` from its
   figure's left edge with the formula above (start from the table —
   if the new sheet keeps the same layout, the same values are very
   close), and `g` from its cell the same way
   (`gx = cellLeft / (2048 − 640) × 100`, `gy = cellTop / (1360 − 640) × 100`).
   Put the numbers in that garment's entry in `js/data.js`.
6. Check the page: the model should stand centred, cropped at mid-thigh,
   and each scan should reveal the right garment on him.

Keep the framing discipline — same man, same size, same bottom edge — and
the swap is a two-line CSS change plus the per-garment numbers in data.js.

---

# The Bottoms and Shoes sheets (added later, same method)

Omar's rule: **each category keeps its own pictures and its own character
sheet, alone** — pants have their own sheet, shoes have their own sheet,
and neither touches the Tops sheets above. Both new categories follow the
same method as Tops (one transparent sprite sheet of the man + one
ghost-mannequin garment sheet + measured crops), with one production
difference: they were generated on a **pure chroma-green background**
and keyed to alpha afterwards, because white-background generations
cannot be colour-keyed without eating the white clothes. The shipped
files are transparent WebPs, the same end state as the Tops PNGs.

## How the sheets were made (the recipe)

1. **Identity reference**: the first figure of the Tops model sheet
   (the white crew tee) was cropped out of that sheet and passed to the
   generator as the identity reference, with the instruction "the same
   man".
2. **Generate on green**: each sheet was generated in one pass — the
   same man five times side by side (or five products in a grid) on a
   **pure solid #00FF00 background, flat and uniform edge to edge**,
   same pose/scale/spacing, feet aligned on one bottom edge.
3. **Chroma-key to alpha** (PIL): alpha from the pixel's "greenness"
   `G − max(R,B)` (≤10 → opaque, ≥55 → transparent, linear between),
   then un-mix the partial edge pixels from the sampled key colour and
   suppress green spill (cap G at max(R,B)+8 on edge pixels).
4. **Measure, don't guess**: the figures/products were located on the
   keyed alpha (column-profile segmentation for the model sheets,
   connected components for the garment sheets) and the crop numbers
   below were computed from the measured pixel boxes with the same
   formulas as the Tops section. The model sheets were trimmed at the
   bottom so every figure's feet sit on the sheet's bottom edge, like
   the Tops sheet.

## Sheet 3 — Bottoms model sheet (`assets/model-bottoms.webp`)

- The same man **full body, head to feet**, five times side by side,
  plain white crew tee and neutral shoes in all five; only the pants
  change: 1. charcoal trousers · 2. blue jeans · 3. beige chinos ·
  4. black joggers · 5. navy shorts.
- Sheet **2480 × 972**; each figure in a **330 × 972** window
  (background-size `751.52% 100%`, position-y 100%).
- `m` per item (in data.js): trousers `3.88` · jeans `27.21` ·
  chinos `50.12` · joggers `73.0` · shorts `95.79`.
- On the page the model stands taller than Tops: height
  `min(84vh, 96vw)` (phone `min(72vh, 150vw)`), lifted `6vh`
  (phone `10vh`) so the hems clear the buy card — all stored per
  category in data.js (`model.height / lift`).

## Sheet 4 — Bottoms garment sheet (`assets/garments-bottoms.webp`)

- Ghost-mannequin pants, 3-over-2 grid (6th cell empty, like Tops):
  top row trousers · jeans · chinos; bottom row joggers · shorts.
- Sheet **1920 × 1280**; square **616 × 616** windows
  (background-size `311.69% 207.79%`).
- `g` per item: trousers `[5.44, 5.95]` · jeans `[49.65, 5.95]` ·
  chinos `[93.75, 6.4]` · joggers `[19.02, 97.44]`.
- **Exception**: the shorts are short enough that their square window
  also caught the hems of the row above (measured: 6,528 foreign
  pixels). The shorts therefore ship as an individual cut-out from
  this same sheet — `assets/item-navy-shorts.webp` — referenced via
  the item's `img` field in data.js instead of `g`.

## Sheet 5 — Shoes model sheet (`assets/model-shoes.webp`)

- The same man **waist-down only** (hips, legs, feet — no torso), five
  times side by side, plain dark charcoal trousers in all five; only
  the shoes change: 1. white sneakers · 2. black leather shoes ·
  3. brown boots · 4. grey running shoes · 5. tan loafers.
- Sheet **2240 × 1072**; each figure in a **415 × 1072** window
  (background-size `539.76% 100%`, position-y 100%).
- `m` per item: sneakers `1.75` · leather `25.86` · boots `49.73` ·
  runners `73.89` · loafers `98.0`.
- On the page the legs stand at height `min(58vh, 110vw)`
  (phone `min(48vh, 110vw)`), lifted `16vh` (phone `25vh`) so the
  shoes — the product — sit fully above the buy card.

## Sheet 6 — Shoes garment sheet (`assets/garments-shoes.webp`)

- Pairs of shoes alone, front three-quarter view, 3-over-2 grid:
  top row sneakers · leather shoes · boots; bottom row runners ·
  loafers.
- Sheet **1920 × 1280**; square **701 × 701** windows
  (background-size `273.89% 182.6%`).
- `g` per item: runners `[18.13, 100]` · loafers `[82.32, 100]`.
- **Exception**: the pairs sit close enough that the windows of the
  sneakers, leather shoes and boots each caught slivers of their
  neighbours (measured: 2,104 / 834 / 660 foreign pixels). Those
  three ship as individual cut-outs from this same sheet —
  `assets/item-white-sneakers.webp`, `assets/item-black-leather.webp`,
  `assets/item-brown-boots.webp` — referenced via the items' `img`
  fields in data.js instead of `g`.

## Recreating these sheets for another person

Same steps as the Tops recreation, per category: photograph/generate
the new person once per item with the framing above (full body for
Bottoms, waist-down for Shoes, same bottom edge), assemble each
category's two sheets, save them in `assets/`, measure the windows
with the formulas in the Tops section, and write the numbers into
that category's entry in `js/data.js` (`model` block + per-item
`g` / `m`). Nothing in `app.js` changes — categories are data.
