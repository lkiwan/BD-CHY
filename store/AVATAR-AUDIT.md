# SURMOI — PHASE 1 AUDIT (2026-11-08)

Audit of the existing project against `AVATAR-SYSTEM.md`. Facts verified by
inspection on 2026-11-08. Nothing was modified.

## 1. Architecture as it exists

- **Stack:** vanilla HTML/CSS/JS. No framework, no build step, no bundler,
  no package.json. 6 JS modules loaded by `index.html` (~1,600 lines total),
  6 CSS files. Only external dependencies: Google Fonts (all pages) and
  Three.js via unpkg (only the separate `3d-test/` page).
- **Deployment:** GitHub Pages from `main` of repo `lkiwan/BD-CHY`, folder
  `store/`. Text files pushed via the GitHub connector; binary assets via
  GitHub web upload. PWA manifest + icons present.
- **Responsive:** phone-first fixed layout; media query ≤ 767 px (arrows
  hidden, drag navigation); desktop layout for the home page. Touch, drag,
  pinch zoom implemented in the shop.

## 2. Components

| Piece | File(s) | State |
|---|---|---|
| Home (doors Homme/Femme) | `index.html` + `js/accueil.js` | Working, live |
| Shop (arc, tabs, buy bar, zoom) | `js/app.js` (789 lines) | Working, live |
| Catalog data | `js/data.js` | 3 categories × 5 items |
| Avatar creation (6 questions) | `js/questions.js` | Working, live |
| Own-face flow | `js/visage.js` | Working, live |
| Order (WhatsApp, COD) | `js/order.js` | Working, but Omar's WhatsApp number is still empty in the code |
| 3D mannequin test | `3d-test/index.html` | Separate test page, not connected to the shop |
| Seller scenarios | `SCENARIOS.html` | Present in repo |

## 3. Avatar implementation — classification (spec §2)

**F — a combination, dominated by E:**

- **E (AI-generated image workflow) — the live shop renderer.** The model is
  one of 125 pre-generated full-outfit photos ("mixes": 5 tops × 5 bottoms
  × 5 shoes, default man only). Selecting items swaps the whole photo.
  Identity/position are stable because every photo was generated on a fixed
  ruler chart and registered to the same coordinates (head y=264, feet
  y=1560, axis x=475 on a 1080×1620 canvas) and verified one by one.
- **A (static images) — avatar creation.** 54 pre-generated body images
  (9 shapes × 3 skin tones × 2 age bands) in `assets/bodies/`; the
  6 questions (Sexe, Âge, Forme, Taille, Poids, Peau) pick one.
- **D (3D model) — experiment only.** `3d-test/` holds a code-built Three.js
  mannequin with the default man's measurements and signs. Not in the shop.
- **NOT C (layered composition).** A layered attempt (25 outfit combos,
  `js/outfits.js` + `css/outfits.css`) was built 2026-11-07, rejected by
  Omar, and reverted. Both files are still in the repo but **not loaded**
  (orphans). The separate transparent garment elements for a layer system
  were never produced (one test element only).

## 4. Catalog (spec §8)

- Categories with items: **Tops, Bottoms, Shoes** (5 items each).
  Tabs **Outerwear** and **Accessories** exist in the UI with **no items**.
- Items carry: name, demo price (USD), sheet-crop coordinates, color swatches.
- **Gap: no unique product IDs** (spec §8 requires one per product).
- **Gap: no garment measurements** anywhere (spec §10 — must not fabricate).
- **Risk:** the Tops model sheet and garment sheet are **hotlinked** to an
  external CDN (`images.higgs.ai` URLs in `css/style.css`), not stored in
  the repo. Bottoms/Shoes sheets are local files. If that CDN dies, Tops
  cards/thumbnails break.
- The mix photos make the garment sheets partly redundant in the shop view
  (cards and buy-bar thumbnails still use the sheets).

## 5. Selection logic & state (spec §13)

- In-memory state in `js/app.js` only; no state library.
- Per-category selection (`sel`: tops/bottoms/shoes) added 2026-11-07:
  choices persist across tabs in the session, arc re-opens on the chosen
  item, model shows the matching mix photo. No page reload on change.
- **Gap: the current outfit is not saved.** Reloading loses the selection.
- **Gap: no saved outfits, no profile list, no load/edit UI** (spec §12–14).

## 6. Storage (spec §14)

- localStorage only, no backend, no accounts. Keys in use:
  `vf_avatar`, `vf_corps` (6-answers + chosen body), `vf_face`,
  `vf_face_cut` (own-face flow), `vf_commandes` (orders).
- Nothing leaves the phone. No measurements are stored (none are collected).

## 7. Measurements & body shape (spec §4–6)

- **No measurement system exists.** No numeric inputs, no validation,
  no cm/inch conversion. The 6 questions use ranges (e.g. height bands),
  not centimetres.
- The spec's §4 reference profile (180 cm, chest 100, waist 84, shoulder
  46, inseam 82…) is **tailor data** (circumferences). The numbers measured
  from the avatar photos on 2026-11-07 (shoulder 37.2, inseam 71.1…) are
  **flat image widths**. Per spec §4/§10 these are different concepts and
  must not be mixed: the §4 values will be stored as the default *profile
  data*; the image values remain *rendering data*.
- Body shapes: the creation flow's 9 formes are not the spec's presets
  (Slim/Regular/Athletic/Broad/Custom), and shapes do **not** affect the
  shop model (default man only).

## 8. Known errors / issues

1. GitHub Pages builds occasionally stall (twice on 2026-11-07, ~17 min;
   fixed by a follow-up commit). Files on `main` are the source of truth.
2. iOS home-screen (PWA) keeps a cached copy of the page; users must
   delete + re-add the icon to see updates.
3. Tops sheets hotlinked externally (see §4 risk).
4. Orphan files in repo: `js/outfits.js`, `css/outfits.css`,
   `assets/outfits/` (reverted feature, not loaded).
5. `NUMERO_WHATSAPP` empty in `js/order.js` — orders open the contact
   picker instead of writing to Omar.
6. No automated tests exist (spec §19). Verification so far: Playwright
   walks on local copies + live HTTP sweeps.

## 9. What already matches the spec

- Default adult male avatar, stable identity/position across clothing
  changes (spec §1, §3) — via the registered mix photos.
- Complete-outfit combination, choices persist in session (spec §1, §13).
- Avatar creation flow with shapes/skins (spec §6, partial).
- Own-face personalisation kept on-device (spec §14, §15 consent model).
- Order flow separated from rendering (spec rule 11).
- Mobile-first, fast: full shop + 125 outfit photos = ~4.5 MB of WebP.

## 10. The one decision before Phase 2

The spec's preferred renderer (§7) is **layered 2D**: one base avatar +
independent transparent garment layers, no new image per combination.
The live shop uses the opposite trade: **pre-composed photos** — more
realistic, but closed (a new garment = 25 new photos; body shape and
measurements can never change what the model looks like).

Spec §7 also says: *"If the project already uses a better rendering
technology, preserve it."* Which one counts as "better" is Omar's call:

- **Option A — keep mixes as the renderer.** Phases 3 (measurements),
  6 (saved avatars/outfits) and the catalog/ID work proceed on top.
  Measurements stay data-only (no visual effect), honestly labelled.
- **Option B — build the layered renderer.** Needs a new asset production
  run: base avatar (no clothes) + one transparent garment asset per item,
  all on the existing 1080×1620 chart. The earlier code-pasting test for
  garment texture was rejected (2026-11-07); garments would be generated
  on the body and extracted — unproven at catalogue scale.

## 11. Development plan (spec §21, mapped to reality)

- **Phase 1 — Audit.** ✅ This file.
- **Phase 2 — Avatar base.** Exists (default man). Under Option B: produce
  the base + first garment layer as a single test piece before scaling.
- **Phase 3 — Measurement system.** New panel: the 12 spec measurements,
  defaults from §4, validation, cm/inch, saved to localStorage. No visual
  claims attached.
- **Phase 4 — Clothing renderer.** Option A: already live (mixes) + add
  product IDs. Option B: layered renderer on the chart coordinate system.
- **Phase 5 — Customization.** Add spec shape presets as data; wire the
  existing 54-body library choice into the shop where assets allow.
- **Phase 6 — Saved avatars/outfits.** Persist `sel` + measurements as
  named profiles (localStorage), with load/edit/reset — extends `vf_*`.
- **Phase 7 — Mobile.** Apply to every new panel; verify by Playwright
  walks + live sweeps (the standing test method).
- **Phase 8 — YouCan prep.** Stable product IDs + exportable outfit/
  product data; no checkout changes.
