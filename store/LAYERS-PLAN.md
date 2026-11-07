# SURMOI — LAYERED RENDERER: PLAN + PROTOTYPE LOG

Omar's decision (2026-11-08): **Option B — build the layered system**
(spec `AVATAR-SYSTEM.md` §7), under his conditions:

- The existing store is NOT touched: vanilla app, 54-body library, face
  flow and the mix renderer stay live and working.
- The layered renderer is developed SEPARATELY (`store/layers-test/` +
  `store/assets/layers/`).
- ONE complete clothing asset first: the basic white T-shirt.
- The prototype is compared against the mix renderer; migration happens
  category by category ONLY if the test is visibly better and technically
  reliable — Omar decides.
- Measurements never claim to change the avatar's proportions.

## Coordinate system (already established, reused)

- Canvas **1080 × 1620** for every asset, transparent PNG (WebP web copies
  only after the prototype passes).
- Scale **7.2 px = 1 cm**; floor/soles **y=1560**; head top **y=264**
  (180 cm); body axis **x=475**.
- Every photo is generated SOLO on the ruler chart (green screen), then
  registered by `mix-src/register.py` to exactly this standard
  (tolerances: head/feet ±7 px, axis ±10 px).
- Layer order: **base → shoes → bottom → top → outerwear → accessories**.

## Assets

| Asset | File | State |
|---|---|---|
| Base avatar (default man, grey boxer briefs, bare chest/arms/legs/feet) | `assets/layers/base/homme-default-base.png` | in production |
| Worn reference (base + white tee) — extraction source only | working file in `layer-src/` | in production |
| T-shirt layer (garment only, full-canvas transparent) | `assets/layers/tops/basic-tshirt.png` | in production |
| Prototype page | `store/layers-test/index.html` | planned |

## T-shirt extraction method

1. Base and worn photos are pixel-registered to the same standard, so a
   per-pixel difference isolates what the tee covers.
2. The difference is kept only inside the tee zone (from the measured
   T-shirt size card on this body): collar y≈473, hem y≈930, torso band
   x 320–630, sleeve band y 470–660 widened to x 265–685.
3. Inside the zone, a pixel joins the garment only if it is fabric-like
   (bright, low saturation — the white tee) and differs from the base.
4. Mask cleaned (largest component), eroded 1 px, alpha feathered ~1 px
   to avoid halos. Layer pixels are copied from the worn photo.

## Verification (all required before the prototype is shown)

- Place numbers for base + worn (head/feet/axis inside tolerance).
- Layer geometry vs the size card (collar, hem, sleeve span).
- Composite (base + layer) vs worn reference: identical inside the mask
  by construction — the real checks are the borders: no skin slivers at
  collar/sleeves/hem, no white fringe outside the garment, skin zones
  outside the garment unchanged from the base.
- Visual check at full size + zoomed crops (collar, sleeve, hem).
- Side-by-side against the mix renderer (mix #001) for the report.

## After the prototype

Omar's go/no-go. If GO: bottoms layer next (same method), then shoes,
then the remaining tops; the shop migrates category by category, mixes
stay as fallback. If NO-GO: the mix renderer stays the system, and
Phases 3/6 (measurements, saved profiles) proceed on top of it.

## Prototype log (2026-11-08)

- **Base changed during production, honestly:** the planned base in
  underwear only could not be generated. Replacement: the same man in a
  black base outfit (compression tee + shorts), bare legs/feet — the
  standard base-suit approach. Two iterations: v2 (relaxed black tee)
  peeked along the torso borders; v3 (tight compression tee) fixed the
  torso. A code attempt to repaint the sleeve ends was tried and
  DISCARDED (striped artifact) — the base file is the clean v3 photo.
- **Registration:** base head y=263, feet y=1556, 179.6 cm, axis 473;
  worn head y=262, feet y=1556, 179.7 cm, axis 473.5. Both in tolerance.
- **Extraction:** mask bbox x 266–674 (card sleeve span 273–677),
  y 470–912; collar ✓. First pass caught a strip of the grey briefs
  below the hem (they pass the brightness test) → hem cut by row
  brightness transition at y=912. Fringe: 0 greenish px. The 6,527
  "missed fabric" px are the excluded briefs, by design.
- **Composite verdict:** torso, collar and hem are clean; the white tee
  sits exactly where the reference photo wears it.
- **ONE remaining defect:** the base's black sleeve ends ~1 cm BELOW
  the white sleeve hem → a thin black band under each sleeve.
  Fix (next step, needs one generation): regenerate the base SLEEVELESS
  (black tank + shorts) so nothing can extend past a garment's sleeve.
- Files: `assets/layers/base/homme-default-base.png`,
  `assets/layers/tops/basic-tshirt.png`,
  `assets/layers/ref/worn-tshirt.png`, page `layers-test/index.html`.
  Scripts: `layer-src/extract-tshirt.py` (layer-src lives in
  game-shots/virtualfit-screens/).
