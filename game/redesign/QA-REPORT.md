# QA REPORT — PLAYM3ANA redesign (Store Posters track)

**Date:** 2026-11-03 · **Method:** Playwright (Python, Chromium headless),
viewport 390×844, `file://` URLs, real clicking, `pageerror` listener on every
page. "Works" = the UI behaves as the real game specifies in `FUNCTIONS.md`
(validation, states, flows) — the previews have no backend by design.
**Rule applied throughout:** no file under `game-*.html` was edited by QA;
defects there are reported for their builders.

---

## 1. Lobby + Profile — 90 checks, 90 PASS (after fixes)

Tested by the QA lead in one continuous session per page (state carries over,
exactly like a player session).

### lobby-store.html

| Area | Checks | Result |
|---|---|---|
| Load + automatic check-in | balance starts 250 → toast "+25 coins · Day 3 claimed" → 275; ladder day 3 flips to claimed; state line updates | PASS ×5 |
| Consent banner (new, §4) | visible on first visit; privacy link; Accept hides it and persists (`localStorage pm3_consent=1`); still hidden after reload | PASS ×4 |
| Category filter tabs | All / Playable / Soon filter the grid; Soon hides the featured block; All restores 7 cards | PASS ×3 |
| Free first play of the day | featured Mafia Play consumes it (toast), button → "▶ Play now", other buttons revert to coin prices | PASS ×3 |
| Play with coins | Sowl unlock deducts 15 (275→260) after the busy state; button → "Play now" | PASS ×2 |
| Watch-ad unlock (Bara) | modal intro names the game; fallback = "No thanks, I'll pay with coins"; watching stage counts 5→0; verify stage; modal closes; game unlocked | PASS ×5 |
| Ad banner (+25) | coins-mode intro hides the pay fallback; after the ad, balance +25 (260→285) | PASS ×2 |
| Missions panel | opens from the teaser; header "1 of 4 completed"; claim goes straight to the ad-watch stage (per FUNCTIONS §6); claim stage after the ad; claiming adds +20 (285→305); count → "2 of 4"; widget badge 2→1 | PASS ×8 |
| Floating missions widget | pill expands the mini-panel; claiming mission 2 from the widget adds +10 (305→315); badge hides at 0 ready | PASS ×3 |
| Friends panel | opens from the nav; 5 friends with "Played with you N times"; error row visible (demo) → Retry hides it and loads a friend; add by button and by Enter; names capped at 14 chars; remove works; at 15 friends the full state shows and the form disables | PASS ×8 |
| Referral | copy button toasts "Code OMAR-7K2P copied — you both win coins" | PASS ×1 |
| Settings sheet | gear opens it; name save toasts; cooldown demo disables the name field + shows the note; password <6 rejected, mismatch rejected, valid change succeeds; Google-account demo disables password fields + note; sound and music switches flip; low-coins demo sets balance to 10 | PASS ×9 |
| Insufficient coins | with balance 10, Play on a 15-coin game → "Not enough coins — watch an ad to play free" error toast; balance unchanged | PASS ×2 |
| Footer | Privacy / Terms / Contact links point at the real legal preview pages | PASS ×1 (was FAIL → fixed, §3) |
| Logout | navigates to login-store.html | PASS ×1 |
| Deep links | `#friends` opens the panel; `#games` scrolls to the grid; `#explore` lands at top (also on `hashchange`) | PASS ×3 |
| JS errors | none in the whole session after the profile clipboard fix (§3) | PASS ×1 |

### profile-store.html

| Area | Checks | Result |
|---|---|---|
| Content | chosen avatar image, username, LEVEL + XP bar, COINS / SESSIONS / STREAK stats, member-since 🇲🇦, recent sessions | PASS ×8 |
| Character picker | 10 options render; clicking one updates the header avatar **and** the nav avatar, stores `pm_avatar`; pick persists across reload | PASS ×4 |
| Referral copy | button feedback flips to "COPIED ✓" | PASS ×1 |
| Navigation | back link to lobby; bottom nav per §2 below, incl. cross-page tab clicks | PASS ×7 |
| JS errors | none after fix (§3) | PASS ×1 |

## 2. Bottom navigation — Omar's spec (Explore / Games / Friends / Profile)

Applied to `lobby-store.html` and `profile-store.html` (replaces Home / Games /
Friends / Account; **Rewards is not a tab** — missions stay on the floating
widget + teaser). Solar icons: compass (Explore), gamepad (Games),
users-group (Friends), the player's `pm-avatar` (Profile). Tested by clicking
every tab on both pages:

| Tab | Lobby behaviour | Profile behaviour | Result |
|---|---|---|---|
| Explore | scrolls the lobby to the top; lime active state on the lobby | links to `lobby-store.html#explore` → lands at top | PASS |
| Games | scrolls to the games grid **and resets the filter to All** | links to `lobby-store.html#games` → lobby opens scrolled to the grid | PASS |
| Friends | opens the Friends panel in place | links to `lobby-store.html#friends` → lobby opens with the panel already open | PASS |
| Profile | links to `profile-store.html`, avatar image shown in the tab | active tab (lime), avatar shown | PASS |
| Labels | exactly `Explore / Games / Friends / Profile` on both pages | same | PASS |

The lobby honours `#friends` / `#games` / `#explore` on load **and** on
`hashchange` (added during QA — same-document hash navigation previously kept
the old scroll position).

## 3. Fixes made during QA (finished pages only)

| # | Page | Defect | Fix | Re-test |
|---|---|---|---|---|
| 1 | lobby | Footer Privacy/Terms/Contact links were dead (`href="#"`) | point at `privacy-store.html` / `terms-store.html` / `contact-store.html` | PASS (suite) |
| 2 | lobby | Deep-link `#explore` did nothing on same-document hash change | hash handling factored into `applyHash()` + `hashchange` listener | PASS (suite) |
| 3 | profile | Clipboard `writeText` rejection unhandled → console pageerror when permission denied | `.catch()` on the copy call | PASS (0 pageerrors) |
| 4 | lobby posters | (Omar's task, §5) baked game names in poster art | all 7 cards + featured swapped to `posters/*-clean.webp`; names are HTML titles now | PASS (§5) |
| 5 | lobby cards | info row (`.meta`, bottom 44px) overlapped the buttons row (50px tall) — measured, not eyeballed | stack re-spaced: title bottom 81px, meta 63px, buttons 9px, fade deepened to 58% — bounding boxes now disjoint on all 7 cards | PASS (measure + screenshots) |
| 6 | login | `?play=` JS rewrote the return note with a 🎮 (and would have wiped the new Solar icon) | emoji dropped from the JS string; note names the game | PASS |

## 4. Built during QA (missing pieces from FUNCTIONS.md)

| Piece | Where | Behaviour verified |
|---|---|---|
| Consent banner (§0) | `lobby-store.html` | cookie/ads bar + Privacy link + Accept; choice persisted in `localStorage pm3_consent`; missions widget lifts while the banner is visible. 4/4 checks PASS |
| Auth callback page (§13) | **new** `auth-callback-store.html` | mirrors the real page: spinner → session resolved → redirect to lobby; `?play=&method=` shows "Back to your game…" and redirects preserving both params; `?error=OAuthAccountNotLinked` shows that error state with Try again / Create account; `?admin=1` shows the admin-landing state (real target `/admin` is outside the preview). 6/6 checks PASS, 0 page errors. **The login/register Google buttons were NOT rewired to it** — they currently demo an info toast, and changing them mid-QA would have altered already-tested behaviour; wiring them is a one-line change whenever Omar wants it (also noted in the hub report). |
| Init-error state (§0) | `loading-store.html` | discreet "demo · init error" toggle → `?error=1` cancels the redirect and shows "The lobby couldn't load" + Reload (reload returns to the normal splash → lobby). Normal flow re-verified. 5/5 checks PASS |
| Guest header / auth sheet (§1, §9, §10) | — | **Not built — the one remaining known gap.** The previews run as the logged-in player everywhere; a guest mode is not a local toggle — it changes the header (login/create instead of coins/level), the hero CTA, unlock attempts (sheet vs `/login?play=`) and the Friends tab behaviour. Bolting it on as a demo switch would misrepresent those flows. It is specced in `PORT-PLAN.md` step 2 to be built from the real `GuestNotice` + lobby guest blocks during the port. |

## 5. Posters — no baked names (Omar's task)

- All 7 lobby cards (Mafia, Bara Salfa, 7azr Fazr, Paint Followers, Sowl,
  Trivia, Karaoke — including both SOON cards) and the featured Mafia art now
  use the clean masters from `posters/*-clean.webp`, resized and re-embedded
  as base64 exactly like the page already did (page size 634 KB → 687 KB).
- Each game's name is an HTML title on the card: bold heavy Nunito, white,
  18.5px, text-shadow, positioned at the bottom over the gradient fade,
  **above** the players/time row. The two failures from Omar's phone
  screenshot are gone: no more baked "BARA SALFA" colliding with the info row,
  no more "PAINT FOLLOWERS" cropped at the top (verified visually +
  bounding-box measurement on all 7 cards).
- Featured Mafia: clean art + its existing HTML `<h3>` title.
- **Builder A's `game-host.html` still uses the OLD named posters** (its
  `POSTERS` map embeds the named Mafia art with the baked title — visually
  verified). A's file was not edited; the swap is a drop-in when A or the
  port step 8 picks it up.
- Screenshots: `~/workspace/game-shots/posters-featured-390.png`,
  `posters-grid-390-a/b/c.png`.

## 6. Solar icons audit (Omar's rule: no emoji as UI icons)

Solar bold icons (inline SVG, `currentColor`, game colours) — **28 swaps** in
finished pages, all re-tested:

| Page | Swapped to Solar |
|---|---|
| lobby | FEATURED tag star · free-play pills gift · card meta users-group + clock · ad buttons tv · SOON locks lock-keyhole · missions target (×2) + restart · friends error danger-triangle · friends sheet header users-group · settings gear + volume-loud + music-notes · "All games" gamepad · friends strip users-group · referral gift · free-play button labels de-emoji'd |
| profile | picker header user · referral header letter · sessions header gamepad · LEVEL badge star · SESSIONS stat gamepad · trailing 🎁 in referral text dropped |
| contact | card icons letter / shield-check / users-group (gold) |
| login | eye toggle eye/eye-closed (JS swap rewired to `innerHTML`) · play-note gamepad · demo buttons close-circle (banned) + snowflake (frozen) · `?play=` note emoji dropped |
| register | both eye toggles eye/eye-closed (JS swap rewired) |

Eye toggles re-tested after the swap: password→text→password on login, both
register toggles work, 0 page errors.

**Kept on purpose (content, not UI chrome)** — and why:
- The 7 Darija **ticker** decorations and the hero headline 💀 — the real
  game's own content lines.
- **Game brand icons** (💀 🤫 🔍 🎨 ❓) in profile session rows — the real
  games' own icons from `games.ts`.
- **🪙 / ⭐ as currency/XP symbols** inside price, reward and button text —
  the real game itself writes coins as 🪙 in its own copy (see its Terms);
  ★ in the coins pill is the coin's face glyph.
- **Toast/message text** (🎉 🔊 🔇 🎵 🎁 inside sentences) and the ad-modal
  sentence headings — message content, not icon slots.
- **🔥 streak flame** — FUNCTIONS §14 defines the streak stat "with flame";
  🇲🇦 member-since marker; the demo ad's ☕ (fake ad creative); register
  success 🎉 (the screen's celebration illustration, no Solar equivalent).

## 7. Auth, legal, avatars (tester A) — 37 checks, 37 PASS

Independent tester, real clicking, `pageerror` listener on every page:
**0 JS errors anywhere, 0 FAIL.**

| Page | Checks | Highlights |
|---|---|---|
| loading-store | 2/2 PASS | progress bar animates (81px → 175px of 212px in ~0.9 s); auto-redirect to the lobby at ~2.4 s |
| login-store | 10/10 PASS | eye toggle (password→text→password, value preserved); Google button full-width (308px of ~310px card), "Gmail only (@gmail.com)", **no Github anywhere in the visible DOM** (the words "github"/"forgot" exist only in code comments stating they don't exist); empty submit → error; all 3 demo states (invalid / banned / frozen) show the right messages; `?play=mafia` note names the game; register + hub links work; **no forgot-password** (correctly absent) |
| register-store | 14/14 PASS | username <3 rejected; invalid chars rejected (pure uppercase is auto-lowercased first, exactly per FUNCTIONS §12, and passes); bad email rejected; **all 5 tested temp-mail domains blocked** (mailinator, guerrillamail, 10minutemail, tempmail, yopmail); password <6 rejected; confirm mismatch rejected; duplicate demo fires on username `omar` **and** on email `omar@gmail.com`; both eye toggles work; referral field accepts a code; valid submit → success screen with own code `TESTPLAYER7-8CGX` (matches `USERNAME-XXXX`); Enter-the-lobby navigates |
| contact-store | 3/3 PASS | `mailto:support@playm3ana.ma`; 3 topic cards; back → lobby |
| privacy-store | 3/3 PASS | 5 sections; links to contact (×2); back → lobby |
| terms-store | 2/2 PASS | 5 sections; back → lobby |
| avatars.js | 3/3 PASS | cleared storage → default avatar; `pm_avatar=3` → lobby header + nav and profile header + nav all show `PM_AVATARS[3]` |

*Post-test note:* the eye toggles and the `?play=` note were re-verified by
the QA lead after the Solar icon swap (§6) — toggles still cycle correctly
with the SVG icons, and the note now names the game without the emoji. All
other A results are unaffected (the swap touched icon markup only).

## 8. Game pages (tester B) — 109 checks, 103 PASS / 6 FAIL

Independent tester, Playwright, `file://`, 390×844, real clicks, `pageerror`
listener on every page. **No `game-*.html` file was edited by QA** — the
defects below are for the builders. At the start of the session
`game-paint.html` and `game-sowl.html` were still PENDING-BUILDER; both
appeared mid-session and were then tested in full — **all 6 pages exist and
were fully tested**. The builders were actively rebuilding during the QA
window (e.g. `game-mafia.html` grew 200 KB → 361 KB); the headline defects
were **re-verified against the final builds** and are still present. Every
page also fails to load Google Fonts (Nunito) from this VM
(`ERR_TUNNEL_CONNECTION_FAILED`) — a network artifact, pages render fine,
not counted as a failure. **Zero JS pageerrors in any real user flow on any
page** (one exception, demo path only — see Mafia).

### game-host.html (§15) — 14 PASS / 3 FAIL

| Area | Result |
|---|---|
| Load, no JS errors; loading overlay hides after load; game iframe present (390×573) and the embedded game renders inside it | PASS |
| Roster pill shows "roster-applied ✓ — Omar, Sara, Yassine, Lina, Karim, Nadia, Mehdi" (§21 demo) | PASS |
| Demo switcher Mafia→Bara swaps iframe src + header; `?g=bara` also loads Bara | PASS |
| ✕ exit-confirm modal with all §15 options (Play Again / Keep playing / Exit); Keep playing closes it; Exit → lobby; modal Play Again closes + reloads | PASS |
| Ad overlay demo: overlay + 5s countdown, auto-dismisses | PASS |
| Game Over modal (demo trigger): trophy, SCORE 850, +40 XP, balance 🪙 250, "First play of the day is free" note; Play Again closes; Back to lobby works | PASS |
| "Table not found" via demo toggle: "مالقيناش هاد الطبلة 🥲" + back-to-lobby works | PASS |
| **Unknown game via URL does NOT show table-not-found** — `game-host.html?g=unknown` loads the normal host, `#notFound` stays hidden; only the demo toggle triggers it | **FAIL** |
| **Play counting never increments (demo-only)** — "Counted this session: 0" before game-over, at game-over, and after Play Again (0 → 0 → 0); the `POST /api/friends/plays` exists only as explanatory copy | **FAIL** |
| **No token/roster in the embed URL** — iframe src is `game-mafia.html?r=<cache-buster>` only; token-gating/roster-passing are simulated in UI copy, not in the URL | **FAIL** |

Note: Game Over / ad / not-found are reachable only through the host's own
demo trigger buttons — no end-to-end `postMessage` game-over from an embedded
game was observed.

### game-mafia.html (§16) — 19 PASS / 2 FAIL

| Area | Result |
|---|---|
| HOME → SETUP; 7 preset players; role-mix note "2 عصابة · 1 بوليس · 1 طبيب · 3 ولاد الحومة"; add-player adds a row | PASS |
| SETUP → DEAL handoff; pass-and-play flip worked for all 7 players; dealt roles match the setup note exactly (Omar+Lina = EISSABA, Nadia = BOULIS, Karim = TBIB, Sara/Yassine/Mehdi = WLADLH) | PASS |
| NIGHT flow: gang picks victim + confirm → police picks + result → doctor picks (button label updates to the picked name) → DAWN | PASS |
| Dawn recap, both variants seen in real play (death announced / doctor saved the victim) | PASS |
| VOTING → ELIMINATION reveal with role text | PASS |
| Full real game played to **WIN · villagers**; WIN · gang screen also renders; both show Play Again + Back to lobby | PASS |
| Win Play Again works (native `confirm()` — accepting returns to SETUP); Back to lobby → lobby-store.html | PASS |
| **Minimum 6 players NOT enforced (reproduced twice, incl. final build)** — stepping down to 5 players shows "باقي 1 لاعبين باش تبدا" but the start CTA still advances to DEAL and deals a complete 5-player game (1 gang). The warning is display-only. Screenshot: `/tmp/qa-shots/game-mafia-min6-bypass.png` | **FAIL** |
| **Demo screen-jump path soft-locks the night phase (demo path only)** — jumping straight to NIGHT without dealing, then gang → police → doctor, picking a save target and confirming does nothing; stuck on the doctor screen. Console: `TypeError: Cannot read properties of undefined (reading 'lab')` at `roleCardHTML` (game-mafia.html:426) inside `buildDawn()` — the victim is marked dead and dawn text is set, but `go('dawn')` never runs. The real dealt flow is unaffected (verified end-to-end). Screenshot: `/tmp/qa-shots/game-mafia-doctor-stuck.png` | **FAIL** |

Minor: the BOULIS card subtitle reads "المحامي" (the lawyer) — looks like a
copy slip next to "البوليس".

### game-bara.html (§17) — 18 PASS / 1 FAIL

| Area | Result |
|---|---|
| Home with start + "؟ كيفاش"; How-to screen shows the rules walkthrough and advances to SETUP | PASS |
| Setup: preset names; count chips resize the list (range 3–15 with a "…" custom chip); 8 category choices | PASS |
| Round category screen announces/picks the category → pass-and-play | PASS |
| Secret-word pass-and-play: each player hold-reveals; 4 players saw the word, exactly one got "نتا برا السالفة 🕵️" with no real word | PASS |
| "نصوتو دابا" and "skip discussion → vote now" both advance to voting; per-voter pass + cast grid (voter's own card excluded) | PASS |
| Verdict reveal (caught); word-guess step: accused picks from 4 word options (+ give-up); correct pick → bonus point. (Variant vs §17's yes/no buttons — functionally equivalent.) | PASS |
| RESULT (outcome + word + points) and SCOREBOARD render correctly | PASS |
| End options all work: next round, new game, same-players restart, back to lobby | PASS |
| Quit ✕ opens quit-confirm modal; keep-playing closes it; Exit → lobby | PASS |
| In-game ad slot visible. No JS errors | PASS |
| **Discussion timer is frozen (reproduced 3×, incl. final build, via real flow and demo jump)** — the digital clock stays at **1:30** and the ring `stroke-dashoffset` stays at 120 over a 6-second window; the countdown never runs and only the skip/vote-now buttons move the game forward. Screenshot: `/tmp/qa-shots/game-bara-discuss-timer.png` | **FAIL** |

### game-7azr.html (§18) — 19 PASS / 0 FAIL

| Area | Result |
|---|---|
| HOME, no JS errors; how-to modal opens/closes with the real rules | PASS |
| Setup: count chips resize name fields; custom count set 9 players; spy-count stepper 1 → 2 → 1; timer chips set the clock (60 → starts 0:59) | PASS |
| Spy REVEAL → PASS rotation: every non-spy privately reveals the same secret action; **the spy gets no card at all** (rotation covers exactly players − spies). Design variant vs §18: the spy's identity is open (announced on the reveal/pre-inter screens) and the spy wins by guessing the action, rather than bluffing unknowingly | PASS |
| PRE-INTERROGATION announces the spy + minutes → INTERROGATION clock counts down in real time (0:59 → 0:57; 1:59 → 0:32 over ~87 s) | PASS |
| Judgement: ❌ registers a strike (0 → 1); 3 wrongs → final "الفريق ربح!"; ✅ → final "الجاسوس ربح!" | PASS |
| Time-up modal fires at 0:00 with its own صح/غلط judgement buttons → final | PASS |
| Final: "بينها" unblurs the secret action; "لعبة أخرى" → AGAIN screen with round summary; same-players new round works; settings option returns to setup | PASS |
| Exit button opens exit-confirm modal; stay closes it; confirm returns HOME | PASS |

Minor: the custom timer input accepts "3" but the game clamps it (pre-inter
showed 1 minute, clock started 0:29 in that probe) — chips work correctly,
only the free-typed value is inconsistent.

### game-paint.html (§19) — 17 PASS / 0 FAIL

| Area | Result |
|---|---|
| HOME, no JS errors; how-to modal (3 phases) opens/closes; HOME → SETUP | PASS |
| **Min-3 enforced properly**: removing players shows the warning and start stays blocked at 1 player (contrast with Mafia); add-player restores the list; category grid present (random default + 5 categories) | PASS |
| Role reveal: hold-to-reveal for all 4 players; 3 share the word, exactly one gets the "🕵️ المحتال — أنت المحتال! مثل أنك تعرف الكلمة!" card (§19 "pretend you know the word", verbatim in spirit) | PASS |
| **Drawing phase verified with real mouse drags: canvas pixels changed on every player's turn** | PASS |
| Palette: 12 swatches, click marks the swatch `on`, strokes afterwards use the picked colour; brush/stroke-width: 4 sizes, click marks `on` | PASS |
| Per-player drawing turns → vote gate → per-voter voting (self-vote disabled) → vote-done → "كشف النتيجة" → RESOLUTION | PASS |
| Resolution announces the impostor; impostor guesses from 4 word options; wrong guess reveals the word (matches §19 wording pattern) | PASS |
| SCOREBOARD with places/points/stars; end options: جولة أخرى / بدّل اللاعبين / رجع للساحة | PASS |
| Quit button opens quit-confirm modal; keep-playing closes it | PASS |

Minor inconsistency: quit-confirm "leave" returns to SETUP here, whereas Bara
exits to the lobby and 7azr to the game home. Default player names are blank
inputs auto-labelled "لاعب N".

### game-sowl.html (§20) — 16 PASS / 0 FAIL

| Area | Result |
|---|---|
| HOME, no JS errors; HOME → SETUP; name input + add button builds the list; players removable | PASS |
| **Min-3 enforced** (start blocked at 2 players, hint shown); **max-8 cap enforced** (9th add refused at 8) | PASS |
| Roulette: name visibly cycles during "selecting", then lands on a player (and round type); round counter advances 1–10 | PASS |
| Choice screen: picked player chooses 🔮 سول or 💪 دير (alternated across 10 rounds) | PASS |
| Challenge card shows question/dare text + points (Sowl +15, Dir +30); "done" button scores; **"سالت — +0" fail button exists and works** (used once mid-game, flow continued) | PASS |
| END after 10 rounds: ranked final scores, top scorer is the winner | PASS |
| End options: عاودو اللعب (restarts into roulette), بدلو اللاعبين, رجع للساحة — all present/working | PASS |
| Quit button opens quit-confirm modal; keep closes it; confirm returns HOME | PASS |
| In-game ad slot visible. No JS errors | PASS |

### Game-page defects ranked (all for the builders — QA edited nothing)

1. **Bara — discussion timer never counts down** (stuck at 1:30, ring static;
   reproduced 3× incl. final build). A core gameplay screen is decorative;
   only the skip buttons save the flow.
2. **Mafia — 6-player minimum not enforced.** The setup warns "you need N
   more players" but the start button deals a full game with 5 (or fewer)
   players anyway (reproduced twice incl. final build). Paint and Sowl
   enforce their minimums correctly — Mafia is the outlier.
3. **Mafia — demo-jump soft-lock:** jumping straight to the night screens
   without dealing makes the doctor's confirm throw
   `TypeError … reading 'lab'` (`roleCardHTML`, line 426) and locks the game
   on the doctor screen. Real dealt games are unaffected.
4. **Host — unknown-game state unreachable via URL** (`?g=unknown` loads the
   normal host; only the demo toggle shows "table not found"), and the
   **play-counting counter never increments** — both §15 items exist as demo
   copy only. The embed URL also carries no token/roster (cache-buster only).

Defect screenshots (tester B): `/tmp/qa-shots/game-bara-discuss-timer.png`,
`/tmp/qa-shots/game-mafia-min6-bypass.png`,
`/tmp/qa-shots/game-mafia-doctor-stuck.png`.

---

## Grand totals — all testers

| Suite | Checks | PASS | FAIL |
|---|---|---|---|
| Lobby + profile (QA lead, §1–§2, §5–§6) | 90 | 90 | 0 |
| Auth / legal / avatars (tester A, §7) | 37 | 37 | 0 |
| Host + 5 games (tester B, §8) | 109 | 103 | 6 |
| **TOTAL** | **236** | **230** | **6** |

All 6 failures are in the builder-owned `game-*.html` files (3 host, 2 Mafia,
1 Bara) — none in the finished pages, and none were edited by QA per the
brief. 7azr, Paint and Sowl are fully green, including Paint's canvas drawing
verified with real mouse drags.

## 9. Coverage after this QA pass (Store track, vs FUNCTIONS.md)

- §0 Global: branded loading DONE · init-error DONE (demo toggle) · consent
  DONE · toasts DONE (lobby) · music/SFX systems: toggles demoed in settings;
  the real players/sounds port with the app (PORT-PLAN step 4) · Arabic RTL:
  localization phase (PORT-PLAN §6).
- §1–§10 Lobby: all DONE in the Store lobby except **guest states** (§4 gap)
  and the fullscreen sponsored-ad modal (exists in the real code as a
  component; its mount point was never confirmed — flagged in PORT-PLAN §7).
- §11–§13 Auth: DONE incl. the new callback page; admin redirect is
  represented as the callback's admin state (the `/admin` UI is out of
  redesign scope, FUNCTIONS §23).
- §14 Profile: DONE except player-not-found (specced for the port, PORT-PLAN
  step 6).
- §15–§21 Host + games + roster: see §8 of this report.
- §22 Legal: DONE (real Darija text, restyled shell, working cross-links).
