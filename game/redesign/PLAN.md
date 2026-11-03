# PLAYM3ANA Redesign — FULL Program (Store Posters direction)

Goal: redesign **every page and every inside-game screen** of the real game
(`lkiwan/loby`, live at nerase.com) in the **Store Posters** style, at full
function parity with the real game. Previews live here in BD-CHY; the real
`loby` repo stays untouched until Omar orders the port.

**Master checklist:** `FUNCTIONS.md` in this folder (146 functions, audited from
the real code on 2026-11-03). No step is "done" until its FUNCTIONS.md items are
checked off.

## Standing rules (apply to every step)

1. **Real content first.** Before designing any page/screen, read its real code in
   `lkiwan/loby` (page/component/game files) and copy the real sections, rules,
   prices and states. Nothing invented — if the real game doesn't have it, the
   redesign doesn't add it (exceptions already approved: the character picker).
2. **English master copy.** All redesign pages are built in English. Arabic /
   French / Spanish come at the dedicated localization step (Step 16), after all
   pages are approved. Game titles (PLAYM3ANA, MAFIA D LHOUMA…) stay as brand
   names. Never bake translated text into images.
3. **Store Posters design system.** Near-black background, poster cards with
   diagonal-cut corners, lime `#C6F542` accent, Nunito type — tokenised in
   `style.css` and reused by every page.
4. **Solar Icons only.** UI icons come from the Solar Icons set (bold style),
   recoloured to game colours (lime = active/accent, white/dim = inactive).
   No emoji as UI icons (emoji inside game content/art is fine).
5. **Avatars system.** The 10 original characters + shared `avatars.js`
   (localStorage `pm_avatar`) stay the profile identity system everywhere a
   player appears.
6. **Posters.** The 7 generated game posters are the game art everywhere a game
   is shown; new art is generated in the same poster style when a screen needs it.
7. **Phone-perfect sizing.** Every page: `.phone` shell max 430px, `100dvh`,
   safe-area insets, scrolling only inside the content area, tab bar always
   visible.
8. **Every step ends with the same gate:**
   a. Parity check — tick the step's items in `FUNCTIONS.md`, update statuses.
   b. Screenshots at **390×844 and 360×740** (top + scrolled bottom for long
      pages), visually inspected before pushing.
   c. Push to BD-CHY (UTF-8 text only — images embedded as base64 or kept as
      masters) and live-verify with curl after Pages propagates.

## Current state (2026-11-03 — post-QA + finishing pass)

DONE in Store style: loading, lobby (full parity build), login, register,
auth callback, profile + character picker, legal trio (contact / privacy /
terms), game host page, and all 5 inside-game pages (Mafia, Bara, 7azr, Paint,
Sowl). Posters ×7 now ship **text-free** with HTML titles (lobby cards, host
loading screen, every game home/win banner). QA exercised the whole checklist:
**236 functions tested, 230 PASS** (`QA-REPORT.md`); the 6 game-page defects
(Bara timer, Mafia min-6, Mafia demo-jump crash, host unknown-game, host play
counting, host token/roster URL) were **FIXED** in the finishing pass — see the
coverage note in `FUNCTIONS.md`. Remaining: guest states (PORT-PLAN step 2),
localization (Step 16), and the port itself (Step 17 — only on Omar's order).

---

## Step 1 — Design system consolidation
Unify all Store pages on `style.css`: colour/type tokens, poster-card component,
buttons (coins / ad / ghost), pills (coins, level), tab bar with Solar icons,
sheet/modal shells, toast. Retrofit `lobby-store.html` onto the shared tokens.
→ Gate: parity §0 (shell items), screenshots, push.

## Step 2 — Loading (Store style) ✔ built — finish & verify
`loading-store.html` exists; add the missing real behaviours as design states:
init-error state with reload button (§0). Confirm logo + loader match the real
LoadingPage structure. → Gate: parity §0, screenshots, push.

## Step 3 — Login (Store style) ✔ built — parity pass
Verify against FUNCTIONS.md §11: identifier (username OR Gmail), eye toggle on
password (add if missing), Google-only button, demo states for invalid / banned /
frozen / gmail-only errors, `?play=` return note, admin-redirect note, register
link, no forgot-password. → Gate: parity §11, screenshots (incl. error state), push.

## Step 4 — Register (Store style) ✔ built — parity pass
Verify against §12: username rules copy (3–20, `[a-z0-9_]`), email + temp-mail
block note, password ≥ 6 + confirm + eye toggles, optional referral field,
duplicate-account error demo, success screen (own code USERNAME-XXXX → auto
sign-in → lobby), 100-coins gift chip, Google button, login link.
→ Gate: parity §12, screenshots (incl. success state), push.

## Step 5 — Lobby full parity (the big one)
Bring `lobby-store.html` to full §1–§10 parity, in sub-steps, one push each:
- **5a Header & status:** hamburger → settings (Step 10), sound + music toggles,
  live coins pill + level pill, guest header state.
- **5b Hero & ticker:** hero block + Play-now CTA, guest create-account CTA,
  the 7 real ticker lines, ambiance cards — all in Store style.
- **5c Games section:** rank badges + snap carousel behaviour on the poster grid,
  per-card details disclosure, play-button states (loading / busy / insufficient),
  ad button on every card, free-first-play-of-the-day state, coming-soon cards.
  Decide the category row: real game = decorative chips; store = working filter
  tabs (confirm with Omar or align to real).
- **5d Check-in:** 7-day ladder (25→250) with today/upcoming/claimed states +
  auto-claim toast demo.
- **5e Referral panel:** code box + copy, "you both win coins".
- **5f Footer + ad banner slot + consent banner.**
→ Gate after each sub-step: parity §1–§5/§8, screenshots, push.

## Step 6 — Profile + character picker (Store style)
Rebuild `profile.html` in Store style at §14 parity: letter-avatar fallback,
username, level + XP + %-to-next bar, 4 stats (coins / sessions / current streak /
longest streak), referral code + copy, recent sessions (+XP, score), member-since,
player-not-found state — with the avatar picker (10 characters, gold ring,
`pm_avatar`) integrated as the profile's identity block.
→ Gate: parity §14, screenshots, push.

## Step 7 — Missions + check-in surfaces
- MissionsPanel modal (§6): list, overall progress, mission cards (progress,
  remaining badge, coin+XP), claimed/empty states, dawn-renewal footer.
- Ad-claim view: native-ad placeholder, 5 s countdown, claim button.
- Floating daily-missions widget: pill + pending badge, expandable mini-panel.
- Lobby "Rewards" entry points wired to open them.
→ Gate: parity §6 (+ §5 states), screenshots (panel + widget + ad-claim), push.

## Step 8 — Leaderboard
There is **no leaderboard page/panel in the real game** — only the
`/api/leaderboard` endpoint and the playful redesign's teaser. Build nothing new
here; if Omar wants a leaderboard surface, it is a new-feature decision for him,
not parity work. (Step kept as a placeholder so the program stays honest:
parity = endpoint noted in FUNCTIONS.md §24.) → No push.

## Step 9 — Friends
FriendsPanel (§7): list with colour letter avatars + "played N times", add form
(≤14 chars, N/15 counter, full state), remove with loading state, loading /
error-with-retry / empty states, roster footer note. Friends strip in the lobby
+ bottom-nav Friends tab (guests → auth sheet).
→ Gate: parity §7, screenshots, push.

## Step 10 — Settings sheet + guest auth sheet + nav finish
- Settings sheet (§9): profile chip, coins row, sound toggle, music toggle,
  change display name (30 chars, 7-day cooldown state), change password
  (Google-account disabled state), guest CTA state, log out.
- Guest auth sheet (§10): 100-coins pitch, login / register, "browse first".
- Bottom nav (§10): real 4 tabs (Home / Games / Friends / Account) with the
  liquid-pill indicator; toast demos for check-in / unlock / welcome-back.
→ Gate: parity §9–§10, screenshots (both sheets), push.

## Step 11 — Auth callback
Spinner screen (§13) with the three redirect outcomes shown as design states
(resume `?play=`, admin → /admin, else lobby). → Gate: parity §13, screenshots, push.

## Step 12 — Five game host pages
One Store-style host page template (§15), instantiated ×5 with each game's
poster/icon: host loading screen (icon + progress, 3 s), roster strip (friends
names going into the game), in-game ad overlay frame, exit-confirm modal,
Game Over modal (trophy, coin balance, Play Again / Back to lobby), play-again
pay-method logic shown as states, "table not found" state.
→ Gate: parity §15, screenshots ×5 hosts, push.

## Step 13 — Inside-game screens, game by game
Rebuild each game's own screens in Store style (static, phone-sized, using its
poster art direction + Solar icons). One game per sub-step, gate after each:
- **13a Mafia (§16):** HOME → SETUP → DEAL_CARDS/PASS_AND_PLAY role reveal
  (BOULIS / EISSABA / TBIB / WLADLH cards) → NIGHT_PHASE actions → dawn recap →
  day VOTING → win screens (gang / villagers).
- **13b Bara Salfa (§17):** home + "How?" → setup (3–15) → how-to → category
  reveal → secret-word pass-and-play → discussion timer → voting → verdict reveal
  (+ word-guess confirm) → scoreboard → end options → quit modal → ad slot.
- **13c 7azr Fazr (§18):** home → setup → pass (word reveal, spy hidden) →
  interrogation → reveal/judgement → final + again.
- **13d Paint Followers (§19):** setup → roleReveal → drawing canvas (brush,
  colours, stroke width) → voting → resolution → scoreboard.
- **13e Sowl wla Dir (§20):** home → setup (3–8) → roulette → Ask-or-Do choice →
  card + done/+0 → end screen → end options → quit modal → ad slot.
- **13f Roster script behaviour (§21):** show the roster-applied state in the
  host/game mock flow.
→ Gate per game: parity for its section, screenshots of every screen at both
sizes, push.

## Step 14 — Win / results surfaces
Cross-game results set: host Game Over modal (done in Step 12) + each game's own
win/results screens (done inside Step 13) gathered into the hub as a "results"
check page so Omar can review all outcomes in one place.
→ Gate: parity §15–§20 win items, screenshots, push.

## Step 15 — Contact / Privacy / Terms
Store-style legal pages (§22) with the real content structure: contact (support
email + 3 topic cards), privacy (5 sections), terms (5 sections), footer links
wired from every lobby. → Gate: parity §22, screenshots, push.

## Step 16 — Localization (after ALL pages approved)
Add Arabic (RTL + Darija/MSA decision), French, Spanish to every approved page:
UI text only, brand/game titles unchanged, posters/art untouched. Solar icons
and layout mirrored for RTL. → Gate: full FUNCTIONS.md sweep in each language,
screenshots, push.

## Step 17 — Final parity sweep & port decision
Re-run the whole FUNCTIONS.md checklist against the finished redesign; coverage
target 100 % of in-scope items (admin excluded). Present the final hub to Omar;
porting into the real `loby` repo happens only on his explicit order.
