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

## Round 2 log (2026-11-08) — more garment types

Omar's validation order: sleeveless base, one trousers, one hoodie,
combination tests, mobile check, store untouched.

- **Sleeveless base (v4):** black tank + compression shorts. Registered
  head 261, feet 1556, 179.9 cm, axis 473. **The sleeve band defect is
  GONE** — verified on the T-shirt sleeve crop: white sleeve ends on skin.
- **Blue jeans layer** (`assets/layers/bottoms/blue-jeans.png`): worn
  photo regenerated with the tank TUCKED IN so the full waistband is
  visible (v1, tank out, cut the jeans top at y=929 → a black strip
  would have shown under tops; v2 top = y=885 ✓). Mask 117,945 px after
  repair, bbox x 335–611, y 885–1490, fringe 0.
- **Grey hoodie layer** (`assets/layers/outerwear/grey-hoodie.png`):
  hood down, drawstrings, kangaroo pocket. Mask 167,123 px after
  repair, bbox x 263–682, y 437–938, fringe 0.
- **Repair pass (both new layers):** the colour tests cut small notches
  into garment edges (shadow edge pixels fail the test) and base skin
  showed through as fake "rips". Fix in `extract-fix.py`: vertical
  closing (17×3) → fill holes → cap by the worn photo's silhouette +2px.
  A second idea (widening the hoodie sleeve into the arm gap with bled
  colours) was tried and DISCARDED — it printed a black rim; the layer
  was restored to the repaired state.
- **Combinations verified** (draw order base → bottom → top):
  tee + jeans = clean, reads like a real outfit photo; hoodie + jeans =
  clean hem-over-waistband; changing the top leaves base + jeans
  pixel-identical (independent <img> layers on the test page).
- **Known residual (hoodie):** at zoom, a thin skin line can show in the
  gap between arm and torso — the base photo's arm sits a few px inward
  vs the hoodie photo's arm (cross-photo pose difference). At phone
  size it is a ~2–3 px line. A fix would need the hoodie photo
  regenerated with arms tighter to the body.
- **Mobile:** Playwright walk at 390×844 — stage fits (359 px), no
  horizontal overflow, all buttons work, combos render. (First walk
  caught a real bug: `let top` collides with `window.top` — renamed.)
- **Still needed (assets):** shoes layer (none yet — avatar is barefoot
  in every composite); a shorter base short if short bottoms are added
  (the base's compression shorts are knee-length); the remaining
  catalogue garments (4 tops, 4 bottoms, 5 shoes) if migration is
  approved; product IDs + YouCan mapping (Phase 8, not started).

## Matte v2 (2026-11-08) — Omar's diagnosis: background removal

Omar named the weak point himself: the background removal makes the
elements look bad. He was right — register.py (v1) forces the matte
binary inside the silhouette, then crushes the whole border ring to
25% opacity: edges come out faded and eaten (thin hair, thin toes).

`mix-src/register-v2.py` (same geometry/anchors): matte segmented at
the RAW's native resolution (greenness ramp → background flood-fill
from the borders + enclosed-green-pocket detection → soft alpha from
the figure mask), despill on the edge band, premultiplied scaling,
NO border crush. A/B on the sleeveless base: v2 keeps the hair and
feet visibly fuller, edges natural on sand and dark, 0 green pixels,
anchors unchanged (head 260, feet 1555, 179.9 cm, axis 474).

**Status: v2 proven on the base only. NOT yet applied to the shop
assets** — re-registering the base + 3 worn photos and re-extracting
the 3 layers awaits Omar's go.

## Garment cut v3 (2026-11-08) — Omar clarified: the ELEMENTS

Omar clarified his complaint: the garment elements themselves (t-shirt,
hoodie…) are not cut well — their pixels came from v1-registered worn
photos, so every garment edge carries the old matte's dark crushed rim
(visible as a thin dark line on the shoulder/sleeve), and the colour
test alone decided the outline.

Fix (`extract-tshirt-v3.py`): worn photo re-registered with v2, seed =
the v1 colour cut (keeps the correct interior boundaries: collar, hem,
sleeve hems), plus a rim snap — silhouette pixels within 3px of the
photo's real outline and within 3px of the seed are added (+428 px on
the tee). A "grow to the silhouette everywhere" variant (dilate 12)
was tried first and DISCARDED: it invaded the neck opening, the
briefs under the hem and the arms.

Result on the T-shirt: the dark rim on the shoulder/sleeve is gone,
the outline follows the photo. Awaiting Omar's verdict before applying
the same cut to hoodie + jeans and re-uploading the set.

## Shirtless base (2026-11-08) — Omar's order

Omar: the default body must have NO black t-shirt, so nothing black
shows at the sides when a stock T-shirt is worn. New base v6: the same
man, bare chest, tight black compression shorts above the knee,
registered with v2 (head 260, feet 1556, 180.0 cm, axis 474).
First attempt (v5, loose board shorts) FAILED its own check: the wide
shorts flared out at the jeans' sides — the base must be tighter than
every garment in every zone, top AND bottom. v6 fixes both: at the
T-shirt's sides you see only skin; the jeans fully cover the shorts.
Verified: full composite + hips zoom + base alone. NOT yet uploaded —
awaits Omar's verdict together with the garment cut v3.

## Jeans v5 + hands layer (2026-11-08) — "not good on the character"

Omar: the pant alone looked fine but NOT good on the character. Two
faults, both from the colour-test cut: (1) small bites in the legs —
invisible on dark, obvious white cuts on the shop's light background;
(2) hand-shaped holes in the layer + the base's hands come from a
different photo → dark patches of base shorts around his fingers.

Fix (`jeans-layer-v5.png` + `hands-patch.png`): the jeans' region =
the worn photo's TRUE SILHOUETTE inside the jeans zone (waistband
y=878 → per-column hem from the old mask); skin pixels inside it
(his hands in that photo, 2,096 px) replaced by nearest-denim bleed.
His hands, cut from the BASE photo itself, are drawn as the LAST
layer — hands in front of the trousers, perfectly aligned with his
arms. Verified: legs zoom (complete denim, no bites), hips zoom
(hands natural, patches gone), full composite. This silhouette-region
method supersedes colour-test cuts for bottoms. Still NOT uploaded;
the test page still runs the old set. Next step = hoodie re-cut the
same way + publish the whole new set (base v6, tee v3, jeans v5,
hands) to the test page, on Omar's go.

## ✅ NEW SYSTEM PUBLISHED (2026-11-08, Omar's "Go")

The whole test page now runs the new-removal system:
- **Base v6** (shirtless, tight shorts, v2 matte) replaces the tank base.
- **T-shirt v3, jeans v5, hoodie v3** — all cut on their photo's true
  outline (silhouette-region method; colour tests only locate).
- **Hands layer** (`assets/layers/base/hands.png`) drawn last on the
  test page; draw order base → bottom → top → hands.
- Hoodie note: its hood stands RAISED around the neck in its source
  photo — the lobes beside the neck are the garment's true shape, kept
  faithful (two trim attempts made it worse and were reverted). A
  flat-hood look needs a new worn photo.
- Mobile walk (390×844, local): no errors, no overflow, all combos
  render; screenshots inspected.
Pending: Omar's verdict on the live page; migration to the real shop
is a separate decision.
