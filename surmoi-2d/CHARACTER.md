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
