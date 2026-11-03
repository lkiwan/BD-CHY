# PORT PLAN — putting the Store Posters redesign into the real game

**Target:** repo `lkiwan/loby` (Next.js 16 App Router, live at nerase.com).
**Source:** the Store Posters previews in this folder (`*-store.html`, `game-*.html`,
`avatars.js`, `posters/*-clean.webp`) + `FUNCTIONS.md` (the 146-function parity
checklist, which stays the acceptance reference for every step below).

The previews are static, self-contained HTML with demo JS. The real app is a
server-rendered Next.js app: Arabic RTL shell (`<html lang="ar" dir="rtl">`,
fonts Cairo / Lalezar / Archivo Black via `next/font`), NextAuth sessions,
Prisma + Redis, Tailwind-style utility classes, and the games themselves as
standalone files under `public/game-files/<id>/` embedded by the host page.
The port is therefore a **re-skin + component restyle**, not a copy-paste:
each preview page is the visual/functional spec for its real counterpart.

---

## 1. Mapping — redesign element → real route / component

| Redesign (preview) | Real target | Notes |
|---|---|---|
| `loading-store.html` (incl. new init-error state) | `src/components/LoadingPage.tsx` + `src/app/(lobby)/loading.tsx` | Keep the real ~15 s init-timeout → error + reload behaviour; take splash art, wordmark and progress bar styling from the preview. |
| `login-store.html` | `src/app/login/page.tsx` (client logic in the flattened `login.tsx`) | Identifier = username **or** Gmail, case-insensitive; error codes `account_banned` / `account_frozen` / `gmail_only` / `OAuthAccountNotLinked` map 1-to-1 to the preview's demo states. |
| `register-store.html` | `src/app/register/page.tsx` + `POST /api/auth/register` | Username `[a-z0-9_]{3,20}`, 17 blocked temp-mail domains, referral field (max 32) → referrer +50. Success screen shows the generated USERNAME-XXXX code. |
| `auth-callback-store.html` (new in QA pass) | `src/app/auth/callback/page.tsx` | Real file already implements: spinner → `getSession()` → `?play=&method=` back to lobby (resume unlock), ADMIN → `/admin`, else `/`. Preview adds the error state the real page lacks (today a failed session silently lands in the lobby). |
| `lobby-store.html` — header (logo, LV pill, coins pill, gear) | `src/app/(lobby)/page.tsx` header block + `MusicPlayer` portal | Coins from `/api/economy/balance` with the pop animation; LV pill = level + mini XP bar. |
| — hero + ticker | lobby page hero section | 7 real Darija ticker lines stay content, unchanged. |
| — games grid + featured Mafia + category tabs | lobby page games section + `src/components/GameCard.tsx`, data from `src/lib/games.ts` | Preview uses **working** All/Playable/Soon filters; the real chips are decorative — porting the working filter is a deliberate behaviour upgrade, flagged for Omar's OK (see §5). Poster art: replace `keyArt`/`logo` in `games.ts` with the clean posters (`posters/*-clean.webp` → `public/images/`), game name rendered as HTML text, never baked in. |
| — check-in ladder + auto-claim toast | lobby page + `POST /api/rewards/checkin` | Ladder from remote config `checkinLadder [25,35,50,75,100,150,250]`; claim is automatic on load, toast "+N coins (day N)". |
| — missions teaser + panel + floating widget | `src/components/MissionsPanel.tsx`, `src/components/DailyMissionButtons.tsx` (both already dynamically imported by the lobby page) | Claim = rewarded ad first (5 s) → `POST /api/rewards/claim {adWatched:true}`. Panel auto-refresh on focus / 8 s in the real component — keep. |
| — friends strip + panel | `src/components/FriendsPanel.tsx` + `/api/friends` | Max 15 friends, names ≤ 14 chars (`src/lib/roster.ts` constants), letter avatars on the 8-colour cycle, "played N times" from `/api/friends/plays` data. |
| — referral strip | lobby page referral block | Code from the profile API; copy button; "you both win coins". |
| — settings sheet | the lobby page's settings sheet (name/password/sound/music/logout blocks) | Name: PATCH `/api/me/name`, 7-day cooldown state. Password: `/api/me/password`, disabled-with-note for Google-created accounts. Sound toggle ↔ global mute (`pm3_muted`), music toggle ↔ `pm3_music_toggle`/`pm3_music_state` events + `MusicPlayer`. |
| — bottom nav (Explore/Games/Friends/Profile) | the lobby page's mobile tab bar | Per Omar's 2026-11-03 choice: **Explore** (Solar compass, lime active) = lobby top · **Games** (gamepad) = scroll to games, All filter · **Friends** (users-group) = opens FriendsPanel (guests → guest auth sheet) · **Profile** = chosen character avatar → `/profile/<username>`. Replaces the real bar's Home/Games/Friends/Account; the liquid pill indicator between Home/Games is dropped with the old bar (noted in §5). |
| — consent banner | `src/components/ConsentBanner.tsx` | Preview persists the choice in `localStorage pm3_consent`; real component already persists its own way — keep the real persistence, take the preview's bar styling. |
| — footer | `src/components/landing/LobbyFooter.tsx` | Brand + Privacy/Terms/Contact links. |
| — guest states (header, hero CTA, auth sheet) | `src/components/landing/GuestNotice.tsx` + guest blocks in the lobby page | **Not redesigned in the previews** (known gap, see QA-REPORT) — port step 2 includes designing these in Store style from the real components before restyling. |
| `profile-store.html` (+ `avatars.js` picker) | `src/app/profile/[username]/page.tsx` + `/api/profile/[username]` | Level/XP bar uses the API's `xpForLvl = 100·n^1.4`. The character picker is a **redesign addition**: needs a new stored field (e.g. `avatarIndex` on the user) + the letter-avatar fallback kept for players who never pick. `avatars.js` (10 webp busts, `pm_avatar` localStorage) becomes a React component + the same images under `public/avatars/`. |
| `contact-store.html` / `privacy-store.html` / `terms-store.html` | `src/app/contact|privacy|terms/page.tsx` inside `src/components/LegalShell.tsx` | Real pages carry the game's actual Darija legal text — the previews kept it verbatim (RTL blocks). Port = restyle `LegalShell` (header, cards, footer) to Store tokens; **do not rewrite the legal text** during the port. |
| `game-host.html` | `src/app/games/[gameId]/page.tsx` (flattened `game_host.tsx`) | Chrome only: top bar, loading screen, ad overlay (`GameAdOverlay`), exit-confirm + Game Over modals. All mechanics (token, roster, postMessage) stay as-is — see §3. **Note: the preview host still embeds the OLD named posters in its POSTERS map — swap to clean posters when porting, same as the lobby.** |
| `game-mafia.html` / `game-bara.html` / `game-7azr.html` / `game-paint.html` / `game-sowl.html` | `public/game-files/<id>/` (mafia, 7azr, paint are React builds; bara, sowl are single-file) | See §2 recommendation. |
| `index.html` (check hub) | — | Preview-only QA index; not ported. |

## 2. Inside the games — recommendation

Two options were considered:

- **A. Host-only theming.** Restyle only the host page chrome (frame, modals,
  loading) and leave the five games' internals untouched. Fast, zero risk to
  game logic — but the games keep the old look, which contradicts Omar's
  "redesign inside the games too" order.
- **B. Full internal restyle (recommended).** Restyle each game's own screens
  using the preview `game-*.html` files as the screen-by-screen spec
  (FUNCTIONS §16–§20), game logic untouched:
  - *Single-file games (Bara Salfa, Sowl)*: edit the one HTML file in place —
    swap its CSS to the Store tokens and its poster/title art to the clean
    posters + HTML titles, exactly as the preview files already demonstrate.
    Lowest-risk full restyle; do these first.
  - *React games (Mafia, 7azr Fazr, Paint Followers)*: apply the tokens in the
    games' source (theme/CSS variables + component class updates) and rebuild.
    The role art in Mafia (BOULIS/EISSABA/TBIB/WLADLH + card back, under
    `posters/roles/` in the preview folder) replaces the current role images.
  - *Shared*: `public/game-files/_roster.v1.js` is **not** restyled — it is a
    logic contract (applies roster names, posts `roster-applied`); only verify
    it still loads inside the restyled pages.

**Recommendation: B**, sequenced single-file games first (quick wins, pattern
proof), React games second, one game per deploy with its own verification gate.

## 3. Design tokens to extract

From the previews' CSS (identical across `*-store.html`):

```css
:root{
  --bg:#07070D;          /* app background, near-black */
  --panel:#101019;       /* card surface */
  --panel2:#15151F;      /* raised surface / inputs */
  --line:#23232F;        /* hairline borders */
  --txt:#FFFFFF; --dim:#9C9CAE;
  --lime:#C6F542;        /* primary accent: active states, CTAs, prices */
  --gold:#FFC93C;        /* coins, rewards, free-play tags */
  --red:#E5484D;         /* errors, banned state */
  --radius:20px;         /* cards; sheets 26px top corners */
  --clip:polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,0 100%); /* diagonal-cut corner */
}
```

- **Type:** Nunito (600–900) for the Latin UI in the previews. The real app is
  Arabic-first: keep **Cairo** as the Arabic workhorse and map the preview's
  heavy display weight to **Lalezar / Archivo Black** for headlines; load Nunito
  alongside for Latin/digits. Do not remove the existing font variables
  (`--font-cairo`, `--font-lalezar`, `--font-grit`) — add `--font-nunito`.
- **Icons:** Solar bold set, inline SVG, `fill:currentColor`, coloured by
  context (lime = active/primary, gold = coins/rewards, white/dim = inactive).
  In the real app these become a small `SolarIcon` React component set
  (compass, gamepad, users-group, user, gear, star, gift, tv, clock-circle,
  lock-keyhole, target, restart, danger-triangle, volume-loud, music-notes,
  letter, shield-check, eye, eye-closed, close-circle, snowflake, check).
  Solar is CC BY 4.0 (480 Design) — keep the attribution comment that already
  lives in the previews' CSS.
- **Tailwind adoption:** the app uses Tailwind utilities with arbitrary values;
  add the tokens as CSS variables on `:root` (globals) and reference them as
  `bg-[var(--panel)]` etc., or extend the theme if a config exists. The
  diagonal-cut corner becomes a utility class (`.cut-corner`) since Tailwind
  has no clip-path utility by default.
- **Safe areas:** previews use `env(safe-area-inset-*)` via `--sab/--sat`;
  keep the same variables in the app shell.

## 4. Wiring list — demo behaviour → real system

Everything in the previews is faked with local state. Per page, the port must
connect:

| Preview demo behaviour | Real wiring |
|---|---|
| Demo login (any credentials, state buttons) | NextAuth credentials + Google providers; server error codes drive the banned/frozen/gmail-only states. `?play=<id>&method=` preserved through login → callback → lobby auto-resumes the unlock. ADMIN role → `/admin` (login + callback). |
| Demo register validation | Same rules server-side in `/api/auth/register` (they already exist): username regex + lowercase, email, 17 blocked temp domains, password ≥ 6, duplicate → `account_exists`, referral code → +50 to referrer, +100 signup grant, own code generated. |
| Coins pill static/demo values; `__demoSetCoins` hook | `/api/economy/balance` (+ `/api/economy/ledger` for history); pop animation on increase; refetch on `?from=game` return with welcome-back toast. **Remove all demo hooks/toggles** (low-coins, cooldown, Google-account, error-state buttons) — they exist only in previews. |
| Check-in toast after 1.1 s | `POST /api/rewards/checkin` on lobby load (authed); ladder + streak from the response; toast system (success/error variants) shared by check-in, unlock, missions, name change. |
| Missions list hard-coded (3 daily + 1 weekly templates) | `/api/rewards/missions`; claim → rewarded-ad flow (`/api/ads/start`, `/api/ads/complete`) → `POST /api/rewards/claim {adWatched:true}`; claim sound; panel closes. DailyMissionButtons shows only when authed, badge = claimable count. |
| Friends list in memory | `/api/friends` GET/POST, `DELETE /api/friends/<id>`; 401 → "log in to see your friends" state; roster note ties to §host wiring. |
| Unlock buttons (coins / ad / free-first-play) | `POST /api/games/unlock` with `Idempotency-Key`, then redirect `/games/<id>` (the redirect carries the token — never render or log it in the UI); free-first-play from remote config `freeFirstPlayDaily`; insufficient balance → error toast steering to the ad; rewarded-ad modal 3 states (intro / watching 5 s / verifying) via the ads API + `FullscreenAdModal`/`useRewardedAd`; guest attempt → guest auth sheet (mobile) or `/login?play=<id>` (desktop). Pay method remembered (`rememberPayMethod`) for one-tap replay. |
| Settings sheet demo toggles | Name → PATCH `/api/me/name` (+ cooldown date from API), password → `/api/me/password` (Google accounts: API-driven disabled state), sound ↔ `pm3_muted` + SFX system (click/ok/error/claim/coin), music ↔ `pm3_music_toggle` event + `MusicPlayer`, logout → NextAuth `signOut` → `/login`. |
| Profile demo stats | `/api/profile/[username]` (public): level, XP + % to next level (`xpForLvl`), coins, sessions, streaks, referral code, recent sessions (+XP, score), member-since; unknown user → "player not found" state (**not in the preview — build during port**). Character picker → persist choice server-side (new field) with letter-avatar fallback. |
| Host page demo buttons (Game over / Ad overlay / Table not found) | Real triggers: iframe `src = /game-files/<id>/index.html?token=…&p=<roster>`; loading screen force-hide at 3 s; exit ✕ → confirm modal; `game-over` postMessage → Game Over modal + balance refetch; `replay-requested` → remembered pay method (ad-first if that was used, else fresh unlock, else lobby); finished play → `POST /api/friends/plays` with roster names; invalid gameId → "table not found". Roster: `encodeRoster(rosterForGame(names, gameId), gameId)` from `src/lib/roster.ts`, confirmed by the game's `roster-applied` postMessage; host must keep checking `e.source === iframe.contentWindow`. |
| In-game demo flows | The games are already real under `public/game-files/` — the port changes their presentation only (§2). Their internal state machines, word lists (`assets/data/categories.json` for Bara) and scoring stay untouched. |
| Ad banner slot "+25" | `AdBanner` / `AdNativeBanner` + ads API; reward = remote config `adRewardCoins` (25), daily cap from config. |
| Consent banner localStorage | Real `ConsentBanner` persistence (cookie/localStorage as implemented today) + privacy link; ads must respect the stored choice (AdSense consent mode as in the real privacy text). |
| Legal pages static text | Server-rendered inside `LegalShell` as today; session-aware header stays. |

## 5. Ordered implementation steps (each with its gate + rollback)

> Rule for every step: **parity vs FUNCTIONS.md + visual check at 390×844 and
> 360×740** (screenshot the real page next to its preview) before the step is
> called done. Deploy one step at a time; every step is independently
> revertible (single-purpose commits; rollback = revert that commit — no
> schema changes until step 7).

1. **Tokens + icon set + shell.** Add CSS variables, `.cut-corner`, Nunito,
   the `SolarIcon` components; restyle the app shell background/panels only.
   *Gate:* lobby visually darker/Store-like with zero layout regressions; all
   existing flows still pass a smoke pass. *Rollback:* revert — pure CSS.
2. **Lobby chrome.** Header pills, hero, ticker, footer, consent banner,
   bottom nav (Explore/Games/Friends/Profile per Omar's spec — this also
   replaces the Account tab with Profile and drops the liquid pill), and the
   **guest states** (header, hero CTA, auth sheet) designed in Store style
   from the real components. *Gate:* guest + authed passes; nav tabs all work;
   `?from=game` toast works. *Rollback:* revert component commits.
3. **Games section + unlock/ad flows.** GameCard restyle with clean posters +
   HTML titles, featured block, filter tabs (behaviour upgrade — confirm with
   Omar at this gate), unlock modal states, ad banner slot. *Gate:* full
   unlock matrix (coins / ad / free-first / insufficient / guest) against the
   real APIs on staging. *Rollback:* revert; posters are static assets.
4. **Check-in, missions, friends, referral, settings.** Restyle the four
   panels/sheet + DailyMissionButtons; wire toasts. *Gate:* claim-with-ad
   flow end-to-end; friends 15-cap + roster note; name-cooldown and
   Google-account password states shown from real API data. *Rollback:*
   revert per component.
5. **Auth pages.** Login, register, **callback (add the error state)** in
   Store style. *Gate:* every error code demoed in the previews reproduced
   against the real auth (banned, frozen, gmail-only, OAuthAccountNotLinked,
   account_exists), `?play=` round-trip, admin redirect. *Rollback:* revert.
6. **Profile + character picker.** Restyle profile; add the avatar field
   (migration), picker UI, letter fallback, player-not-found state. *Gate:*
   public profile URLs unchanged; picker persists across devices once
   server-side. *Rollback:* revert UI; the new column is additive and can
   stay harmlessly if the UI is reverted.
7. **Legal pages.** Restyle `LegalShell` + the three pages (text untouched).
   *Gate:* Darija text byte-identical before/after (diff the rendered text).
   *Rollback:* revert.
8. **Host page chrome.** Restyle `/games/[gameId]`: loading, frame, ad
   overlay, exit/Game Over modals; swap POSTERS art to clean posters.
   *Gate:* token + roster + postMessage contract tests (roster-applied,
   game-over, replay-requested), play counting, table-not-found.
   *Rollback:* revert — no game files touched in this step.
9. **Inside the games — single-file first** (Bara, Sowl), then **React games**
   (Mafia incl. role art, 7azr, Paint). One game per deploy. *Gate per game:*
   FUNCTIONS §17/§20 (resp. §16/§18/§19) screen-by-screen pass in the real
   build, roster script still applying names, host modals still firing.
   *Rollback:* each game folder is self-contained — restore the previous
   folder snapshot.
10. **Cleanup + full parity sweep.** Remove any leftover old-style assets,
    re-run the FUNCTIONS.md checklist against production, update coverage.
    *Gate:* the QA-REPORT table re-run on the live site.

## 6. Localization (after the port stabilizes)

Deliberately **after** step 10, as its own project (per Omar's standing
rule): the previews are an English master copy; the real game is Arabic RTL
today. Work: (1) decide **Darija vs MSA** for Arabic UI strings (the game's
voice is Darija — legal pages and ticker are already Darija); (2) extract all
UI strings from the ported components into locale files for **Arabic, French,
English, Spanish**; (3) make layout direction a per-locale property (RTL for
Arabic, LTR otherwise) and verify every screen in both directions — poster
titles and HTML game names are text, so they localize cleanly (this is why
names were de-baked from the art); (4) keep brand names (PLAYM3ANA, game
titles) untranslated; (5) numbers/dates (member-since, cooldown dates)
through locale formatters. No image ships with baked text by then, so no art
needs regenerating.

## 7. Risks & open items

- **Token verification on the host page (audit finding, 2026-10-07):**
  `src/proxy.ts` only checks that a `token` query param exists on
  `/games/<id>` — it does not verify it. There is a `/api/games/verify-token`
  route; the port (step 8) must not weaken this further, and closing the gap
  (verify the token server-side before the iframe is served) should be
  scheduled alongside — it is a security fix, not a design task. No token
  values appear in any preview, plan, or report.
- **Committed-token history (pending on Omar's side):** in Oct 2026, two live
  game tokens were committed in log files on the `loby` master branch
  (GitGuardian flagged it). Rotation + history scrub are still pending and
  are **Omar's action**, independent of this port — but they should happen
  before any wider launch push. (No values recorded here.)
- **GitHub Pages ≠ production:** previews are static files on Pages
  (BD-CHY repo) with demo state; production is the Next.js app at nerase.com.
  Nothing from the preview repo deploys to production automatically — the
  port is manual, step-by-step work in `lkiwan/loby`, and Pages previews
  remain the visual reference until each step lands.
- **Behaviour deviations introduced by the previews** (need Omar's OK at the
  gates, not silent adoption): working category filters (real chips are
  decorative); the new bottom nav (Account → Profile, liquid pill dropped);
  the callback error state (real page has none); the character picker
  (addition, needs the step-6 migration).
- **Known preview gaps carried into the plan:** guest header/hero/auth-sheet
  (step 2), player-not-found (step 6), fullscreen sponsored-ad modal mount
  point unconfirmed in the real code (verify during step 3 — it exists as a
  component; where it mounts was not confirmed in the audit).
- **Fonts:** Nunito has no Arabic glyphs — never let it become the Arabic
  font; it is Latin/digits only (Cairo covers Arabic).
