# PLAYM3ANA — Master Function Checklist (parity audit)

Source of truth: the real game code in `lkiwan/loby` (Next.js app + `public/game-files/`),
read file by file on 2026-11-03. Every user-facing function of the real game is listed
below as a checkbox. **Redesign status** is judged against the **Store Posters track**
(the chosen direction: `lobby-store.html`, `login-store.html`, `register-store.html`,
`loading-store.html`, `style.css`, posters, avatars system). Where a function exists only
in the Adult Playful (`lobby.html`, `login.html`, `register.html`, `profile.html`) or
Night Glass (`lobby-glass.html`) versions, the status is PARTIAL and the note says where.

Status key: **DONE** = present in the Store track · **PARTIAL** = only in another style
track, or present but incomplete · **MISSING** = not in the redesign folder at all.

> **Coverage update (2026-11-03, post-QA + finishing pass):** the full checklist was
> exercised by Playwright QA — **236 functions tested, 230 PASS** (see `QA-REPORT.md`).
> The only 6 failures were in the game pages and are now **FIXED** (finishing pass,
> 2026-11-03): ① Bara discussion timer never counted down → now ticks (1 s interval,
> ring depletes, low-time colour ≤20 s, time-up starts the vote); ② Mafia 6-player
> minimum was display-only → the start CTA is now disabled/blocked below 6, like the
> real game; ③ Mafia demo-jump to NIGHT/DAWN without dealing crashed `buildDawn`
> (TypeError reading 'lab') → demo jumps now deal a demo game first, with guards in
> `buildDawn`/`roleCardHTML`; ④ Host `?g=<unknown>` loaded Mafia instead of the
> "table not found" state → any unknown `g` now shows it; ⑤ Host play counting never
> incremented → Game Over (postMessage or demo trigger) now counts the play and shows
> "Counted this session"; ⑥ Host embed URL carried no token/roster → it now follows
> the real contract (`?token=demo&p=<JSON roster>`, ROSTER_PARAM `p` from
> `src/lib/roster.ts`; placeholder token only, never a real one) and the games read
> the roster from the URL. The BOULIS card subtitle flagged in QA ("المحامي") was
> verified **verbatim against the real game** (`game_mafia.js` role map: BOULIS sub
> is "المحامي" in the shipped game itself) and kept; the WLADLH card was aligned to
> the same real table ("ولاد الحومة" / "المدنيين"). Known remaining gap: guest states
> (see QA-REPORT §4 / PORT-PLAN step 2); localization is Step 16.

Real-game economy rules (from `src/lib/config.ts` / `ledger.ts`, for reference in every
step): signup grant **100 coins** · check-in ladder **[25, 35, 50, 75, 100, 150, 250]**
over a 7-day streak cycle · rewarded-ad reward **25 coins** · referral bonus **50 coins**
(referrer, when a signup uses their code) · **first play of the day is free** · missions
**3 daily + 1 weekly** · session XP base 10 / cap 50 · account **level rises +1 every
10 games played** (profile also shows an XP progress bar, see §14).

---

## 0. Global shell & shared systems

- [ ] **Arabic RTL app shell** — real game is `lang="ar" dir="rtl"`, fonts Cairo /
  Lalezar / Archivo Black. Redesign is English LTR master copy by standing rule;
  Arabic returns at the localization step. — PARTIAL (by design)
- [ ] **Consent banner** — cookie/ads consent bar with accept button + privacy link,
  choice persisted. — MISSING
- [ ] **Background music player** — lobby header portal; play/pause state shared via
  `pm3_music_toggle` / `pm3_music_state` events; toggle lives in header + settings. — MISSING
- [ ] **Sound-effects system** — UI sounds (click / ok / error / claim / coin) with a
  global mute persisted in local storage (`pm3_muted`). — MISSING
- [ ] **Branded loading screen** — logo, animated pencil loader, PLAYM3ANA wordmark,
  "loading…" message (`LoadingPage` component + lobby `loading.tsx` fallback). — DONE
  (`loading-store.html`, `loading.html`)
- [ ] **Init-error screen** — if the lobby fails to initialise (~15 s), an error screen
  with a reload button appears. — MISSING
- [ ] **Toast system** — bottom toast, success (green) / error (red) variants, used by
  check-in, unlock, missions, name change, etc. — PARTIAL (demo toasts in playful pages only)

## 1. Lobby — header & player status

- [ ] **Header bar** — logo + hamburger button that opens the Settings sheet. — PARTIAL
  (store header has avatar + coins, no hamburger/settings)
- [ ] **Sound mute toggle (header)** — speaker on/off. — MISSING
- [ ] **Music toggle (header)** — via the music portal. — MISSING
- [ ] **Coins pill** — fixed pill showing live balance (`/api/economy/balance`), with a
  pop animation when coins increase. — PARTIAL (store shows a static balance)
- [ ] **Level pill** — LV number + mini XP progress bar, fixed beside the coins pill. —
  PARTIAL (playful lobby only)
- [ ] **Guest header state** — logged-out visitors see login / create-account actions
  instead of coins/level. — PARTIAL

## 2. Lobby — hero & ticker

- [ ] **Hero** — hero image, headline (games are better with your friends), "Play now"
  CTA scrolling to the games section. — PARTIAL (playful + glass lobbies only)
- [ ] **Guest hero CTA** — "Create account" button under the hero for guests. — PARTIAL
- [ ] **Live ticker** — scrolling strip with the game's 7 real Darija ticker lines. —
  PARTIAL (playful lobby, corrected to the real lines; absent from store lobby)
- [ ] **Moroccan ambiance cards** — 3 decorative cards under the hero. — MISSING

## 3. Lobby — games section

- [ ] **Games grid with poster art** — each game: art, name, coin price, player range,
  duration (Mafia 25c / 6+ / 25 min · Bara Salfa 20c / 3–15 / 15 min · 7azr Fazr 15c /
  3–15 / 15 min · Paint Followers 15c / 3–15 / 15 min · Sowl wla Dir 15c / 3–8 / 10 min).
  — DONE (store lobby, poster cards)
- [ ] **Featured game block** — Mafia featured with both unlock buttons: "Play · 25"
  (coins) and "Watch ad · Free". — DONE (store lobby)
- [ ] **Mobile snap carousel + rank badges 1–5** — on mobile the real section is a
  snap-scroll carousel with a rank badge on each card. — MISSING
- [ ] **Per-card details disclosure** — every GameCard has an expandable "details"
  area. — MISSING
- [ ] **Play (coins) button states** — loading spinner while unlocking, busy state while
  another action runs, insufficient-balance state. — PARTIAL (static button in store)
- [ ] **Watch-ad button on every card** — direct-ad entry on each GameCard, not only
  the featured one. — PARTIAL (store: featured only)
- [ ] **Free first play of the day** — the day's first play is free (config); cards /
  unlock flow must reflect the free state. — MISSING
- [ ] **Coming-soon games** — Trivia D Lhouma and Karaoke Lhouma shown as locked
  "SOON" cards. — DONE (store lobby)
- [ ] **Category chips** — 5 decorative (non-functional) category chips above the grid.
  Note: the store lobby instead has working All / Playable / Soon filter tabs — a
  deliberate deviation to confirm or align. — PARTIAL

## 4. Lobby — unlock & rewarded-ad flows

- [ ] **Unlock with coins** — POST `/api/games/unlock` (with an Idempotency-Key) then
  redirect to `/games/<id>`; coin-burst particles + sound on success. — MISSING
- [ ] **Guest unlock attempt** — guests get the guest auth sheet (mobile) or are sent
  to `/login?play=<id>` (desktop) instead of unlocking. — PARTIAL (`?play=` note exists
  on login pages; sheet missing, see §10)
- [ ] **Insufficient coins** — error toast telling the player to watch an ad instead. — MISSING
- [ ] **Rewarded-ad modal — intro state** — explains the deal (watch the ad, the table
  opens free) with a "watch the ad" CTA; fallback button: authed → "no thanks, I'll pay
  with coins", guest → "create an account — play with coins". — MISSING
- [ ] **Rewarded-ad modal — watching state** — native ad banner + 5-second countdown. — MISSING
- [ ] **Rewarded-ad modal — verifying state** — confirmation screen, then redirect into
  the game, or **+25 coins** toast when the ad was for coins. — MISSING
- [ ] **Fullscreen sponsored-ad modal** — full-screen ad component with skip-after-
  countdown and "skip & enter the game" (exists in the codebase; its mount point was
  not confirmed in the lobby/host files read). — MISSING
- [ ] **Lobby ad banner slot** — an `AdBanner` sits between the games/referral area and
  the footer. — MISSING

## 5. Lobby — daily check-in & rewards

- [ ] **Automatic check-in claim** — on login the lobby POSTs `/api/rewards/checkin`
  and celebrates with a toast "+<reward> coins (day N)" + coin pop; reward follows the
  ladder [25, 35, 50, 75, 100, 150, 250] by streak day. — PARTIAL (store lobby has a
  manual "Daily reward ready — CLAIM" strip with streak day; auto-claim + toast not shown)
- [ ] **7-day check-in ladder display** — the week's 7 day-boxes with amounts
  25 → 250 and today claimed/upcoming states. — PARTIAL (playful lobby only)

## 6. Missions

- [ ] **Missions entry point in the lobby** — opens the MissionsPanel. — PARTIAL
  (playful lobby has a missions teaser; store lobby's "Rewards" nav tab is a placeholder)
- [ ] **MissionsPanel — list** — missions from `/api/rewards/missions`, auto-refreshed
  on window focus and every 8 s; header shows "N of M completed"; overall daily
  progress bar with %. — MISSING
- [ ] **Mission card** — title, progress bar, progress/target counter, "remaining N"
  badge, coin + XP rewards; claimable cards highlighted. — MISSING
- [ ] **Claim = watch an ad first** — tapping claim opens an ad-claim view (native ad
  banner, 5 s countdown) and only then a claim button; POST `/api/rewards/claim`
  with `adWatched: true`; success plays the claim sound, adds coins, closes panel. — MISSING
- [ ] **Mission states** — claimed (dimmed, green, "done ✓"), empty state ("no missions
  right now — they renew tomorrow"), footer "renews every day at dawn", all-done
  trophy note. — MISSING
- [ ] **Floating daily-missions widget** — authed only; pill button ("Today's missions"
  + pending-count badge) fixed above the bottom nav; expands to a mini-panel with up
  to 4 missions and the same ad-claim flow. — MISSING
- [ ] **Mission templates (content)** — daily: play 3 games (+20c / +10 XP); daily:
  play a specific/new game (+10c / +15 XP); weekly: play 10 games (+100c / +50 XP). — MISSING

## 7. Friends

- [ ] **Friends strip in the lobby** — preview strip of the friends list. — PARTIAL
  (playful lobby only, decorative)
- [ ] **FriendsPanel — list** — friends from `/api/friends`, coloured letter avatars
  (8-colour cycle), and "played with you N times" per friend. — MISSING
- [ ] **Add friend** — name field (max 14 chars, Enter submits) → POST `/api/friends`;
  header counter shows N/15 (max 15 friends); full state disables the form. — MISSING
- [ ] **Remove friend** — delete button per row (DELETE `/api/friends/<id>`) with
  per-row loading state. — MISSING
- [ ] **Panel states** — loading spinner; load-error state with retry button (401 →
  "log in to see your friends"); empty state. — MISSING
- [ ] **Roster note** — panel footer: "your names appear automatically in every game"
  (the list feeds the in-game roster, §15). — MISSING

## 8. Referral (lobby panel)

- [ ] **Referral panel** — shown to authed users who have a code: code in a copyable
  box + copy button, "share the code — you both win free coins". — PARTIAL (playful
  lobby only)

## 9. Settings sheet

- [ ] **Sheet shell** — bottom sheet on mobile / centred modal on desktop, scrollable,
  backdrop-tap closes; opened from the header hamburger and the Account tab. — MISSING
- [ ] **Profile link chip** — jumps to `/profile/<username>`. — MISSING
- [ ] **Coins row** — current balance display. — MISSING
- [ ] **Sound toggle** — switch bound to the global mute. — MISSING
- [ ] **Music toggle** — switch dispatching the music toggle event. — MISSING
- [ ] **Change display name** — shows the original account username (+ email); input
  max 30 chars; save via PATCH `/api/me/name`. **7-day cooldown**: when not allowed,
  the field is disabled with a "you can change again after <date>" note. — MISSING
- [ ] **Change password** — current / new / confirm fields, new password ≥ 6 chars,
  via `/api/me/password`. Google-created accounts: fields disabled with a note that
  the account was registered with Google and has no password. — MISSING
- [ ] **Guest state** — logged-out users see login / register buttons instead. — MISSING
- [ ] **Log out** — sign-out button → returns to /login. — MISSING

## 10. Bottom navigation, toasts & guest auth sheet

- [ ] **Bottom nav (mobile)** — 4 tabs: Home, Games (scrolls to the games section),
  Friends (opens FriendsPanel; guests get the auth sheet), Account (opens Settings
  sheet). Note: the store nav is Explore / Games / Rewards / Profile — Rewards is not
  a real tab and Friends is missing. — PARTIAL
- [ ] **Liquid pill indicator** — one shared highlight pill that slides/stretches
  between the Home and Games tabs following scroll. — MISSING
- [ ] **Guest auth sheet** — bottom sheet for guests: "members only" pitch, the
  100-coins signup gift, Login button, "Create account — free" button, and a
  "browse the tables first" dismiss link. — MISSING
- [ ] **`?from=game` return handling** — returning from a game refetches the balance
  and shows a welcome-back toast. — MISSING

## 11. Login page

- [ ] **Identifier field** — username **or** Gmail; trimmed, case-insensitive lookup. —
  DONE (store login, "username OR email")
- [ ] **Password field with eye toggle** — show/hide password. — PARTIAL (playful login
  has it; store login check pending)
- [ ] **Google sign-in** — full-width button; **Gmail/Google only — there is NO Github
  login in the real game**. — DONE (store login)
- [ ] **Error states (demo'd)** — wrong credentials, **banned** account
  (`account_banned`), **frozen** account (`account_frozen`), `gmail_only`,
  `OAuthAccountNotLinked`. — DONE (store login demos banned/frozen states)
- [ ] **`?play=` return** — a login started from a game keeps `?play=<id>&method=` and,
  after login, the lobby automatically resumes that unlock. — DONE (return note on
  login pages)
- [ ] **Admin redirect** — ADMIN accounts land on /admin after login. — MISSING
- [ ] **Link to register** — DONE (store login)
- [ ] **No forgot-password** — the real game has none; the redesign correctly omits
  it. — DONE (correctly absent)

## 12. Register page

- [ ] **Username rules** — 3–20 chars, `[a-z0-9_]` only, auto-lowercased. — PARTIAL
  (full rules in playful register; store register fields present, rules copy to verify)
- [ ] **Email validation** — valid email required; **17 temporary-mail domains are
  blocked**. — PARTIAL (playful register)
- [ ] **Password rules** — at least 6 chars + confirmation must match; eye toggles. —
  PARTIAL (store register has eye toggles; full rule set in playful register)
- [ ] **Optional referral code field** — max 32 chars; using one pays the referrer
  **+50 coins**. — PARTIAL (field present in store register; behaviour copy in playful)
- [ ] **Duplicate account rejected** — `account_exists` error state. — PARTIAL (playful)
- [ ] **Success screen** — shows the new player's own referral code (USERNAME-XXXX
  pattern), then auto sign-in → lobby (fallback: /login). — PARTIAL (playful)
- [ ] **Signup-gift chip** — header chip advertising the 100-coins starting gift. —
  PARTIAL (playful)
- [ ] **Google sign-up** — Gmail-only social button. — DONE (store register)
- [ ] **Link to login** — DONE (store register)

## 13. Auth callback

- [ ] **/auth/callback** — spinner screen; resolves the session, then redirects:
  honours `?play=&method=` (back to lobby, resume unlock), ADMIN → /admin, everyone
  else → lobby. — MISSING

## 14. Profile page (`/profile/[username]`, public)

- [ ] **Letter avatar** — gold circle with the username's first letter. Note: the
  redesign deliberately replaces this with the character picker below (Omar's
  direction) — keep a letter fallback for players without a character. — PARTIAL
- [ ] **Username** — DONE (`profile.html`)
- [ ] **Level + XP bar** — LEVEL, XP total, and "% to next level" progress bar
  (level curve xpForLvl = 100 · n^1.4 in the profile API data). — DONE
- [ ] **Stat: coins** — DONE
- [ ] **Stat: sessions played** — DONE
- [ ] **Stat: current streak** (days, flame) — DONE
- [ ] **Stat: longest streak** (days) — DONE
- [ ] **Referral code + copy** — code box with copy button, "you both win coins". — DONE
- [ ] **Recent sessions list** — each with +XP earned and score. — DONE
- [ ] **Member-since line** — with the 🇲🇦 marker. — PARTIAL (present in playful
  profile; verify on the final profile design)
- [ ] **Player-not-found state** — "player not found" + back-to-lobby button. — MISSING
- [ ] **Character picker (redesign addition, not in the real game)** — 10 original
  characters, gold ring on the selected one, saved to local storage (`pm_avatar`);
  the chosen character also appears in the store lobby header and the nav Profile
  slot (shared `avatars.js`). — DONE (addition)

## 15. Game host page (`/games/[gameId]`)

- [ ] **Token-gated game embed** — the game runs in an iframe at
  `/game-files/<id>/index.html?token=…&roster=…`; the token comes from the unlock
  redirect. (Token values are secrets — never display or reuse them in previews.) — MISSING
  → **FIXED (finishing pass 2026-11-03):** the preview embed URL now matches the real
  contract's shape — `?token=demo&p=<JSON roster>` (`p` = ROSTER_PARAM in
  `src/lib/roster.ts`); the token is the literal placeholder `demo`, never a real value.
- [ ] **Host loading screen** — game icon + progress bar; force-hides after 3 s. — MISSING
- [ ] **Roster passing** — the player's friends list (merged with a per-session
  override) is encoded per game (`src/lib/roster.ts`) and handed to the game; the
  game confirms with a `roster-applied` postMessage. — MISSING
  → **FIXED (finishing pass 2026-11-03):** the host passes the demo roster in the
  embed URL (`p` param); `game-mafia.html` / `game-bara.html` read it and the games
  report the names back via `roster-applied`.
- [ ] **In-game ad overlay** — `GameAdOverlay` is displayed over the game while
  playing. — MISSING
- [ ] **Exit-confirm modal** — top-right ✕ asks first: progress will be lost;
  Play Again / Keep playing / Exit. — MISSING
- [ ] **Game Over modal** — on the game's `game-over` postMessage: trophy, refreshed
  coin balance, Play Again / Back to lobby. — MISSING
- [ ] **Play Again logic** — reuses the remembered pay method (ad first if that was
  remembered, otherwise a fresh coins unlock, otherwise back to the lobby); also
  handles the game's `replay-requested` message. — MISSING
- [ ] **Play counting** — a finished play is recorded via POST `/api/friends/plays`
  with the roster names (feeds friends' "played N times" and mission progress). — MISSING
  → **FIXED (finishing pass 2026-11-03):** Game Over (real `game-over` postMessage
  or the demo trigger) now increments "Counted this session" in the host.
- [ ] **Unknown game** — an invalid gameId shows a "table not found" page. — MISSING
  → **FIXED (finishing pass 2026-11-03):** `game-host.html?g=<anything unknown>`
  now shows the "table not found" state, like the real host.

## 16. Inside the game — Mafia D Lhouma (React app in `public/game-files/mafia/`)

- [ ] **HOME screen** — title screen with the game's art and start. — MISSING
- [ ] **SETUP screen** — enter the players (6+); role mix is dealt from the player
  count. — MISSING
  → **FIXED (finishing pass 2026-11-03):** the 6-player minimum is now enforced —
  below 6 the deal CTA is disabled and `deal()` returns early (the real game's
  `startGame` does the same). The demo-jump soft-lock is also FIXED: jumping to
  NIGHT/DAWN without dealing now deals a demo game first (no more TypeError in
  `buildDawn`).
- [ ] **DEAL_CARDS + PASS_AND_PLAY role reveal** — the phone is passed around; each
  player privately flips their role card. Roles: **BOULIS** (police), **EISSABA**
  (the mafia gang), **TBIB** (doctor), **WLADLH** (villagers) — each with its own
  role image and a shared card back. — MISSING
- [ ] **NIGHT_PHASE** — pass-and-play night actions: the gang picks a victim, the
  doctor picks someone to save, the police picks someone to investigate. — MISSING
- [ ] **Dawn recap** — "what happened at night" announcement: who died, or "nobody
  died tonight" when the doctor's save worked; day begins. — MISSING
- [ ] **Day discussion + VOTING phase** — players debate, then vote to eliminate one
  player; the elimination is revealed. — MISSING
- [ ] **Win screens** — "The gang won!" / "The villagers won!" end states with
  play-again. — MISSING

## 17. Inside the game — Bara Salfa (single-file game, pass-and-play word game)

- [ ] **Home screen** — background art, title, start button, "How?" (how to play)
  button. — MISSING
- [ ] **Setup** — player-names list + player count (3–15). — MISSING
- [ ] **How-to screens** — rules walkthrough with "understood — let's start" steps. — MISSING
- [ ] **Round category reveal** — each round first announces its category (the word
  lists live in `assets/data/categories.json`: neighbourhood, social media, love…).
  — MISSING
- [ ] **Secret-word pass-and-play** — each player taps "I am <name> ✋" to privately
  see the word, then "I saw it — next →"; one player is secretly "out of the topic"
  and does not get the real word. — MISSING
- [ ] **Discussion timer** — timed discussion with a ring/clock countdown; "skip
  discussion and vote now" shortcut. — MISSING
  → **FIXED (finishing pass 2026-11-03):** the countdown now actually ticks (1 s
  interval, ring depletes, terra colour under 20 s, time-up moves to the vote);
  the skip / vote-now buttons still cut it short.
- [ ] **Voting** — "let's vote now" vote round to accuse one player. — MISSING
- [ ] **Verdict reveal** — "Caught! <name> is out of the topic!" or "He escaped —
  <name> was out of the topic!"; then the accused can still guess the word
  (yes / no confirmation buttons decide it). — MISSING
- [ ] **Scoreboard** — "see the full points" table. — MISSING
- [ ] **Round / game end options** — next round, new game, same-players restart,
  back to the lobby ("the square"). — MISSING
- [ ] **Quit button + quit-confirm modal** — "leave the game?" with exit / keep
  playing. — MISSING
- [ ] **In-game ad slot** — fixed ad slot rendered inside the game page. — MISSING

## 18. Inside the game — 7azr Fazr (React app; spy/guessing game)

- [ ] **Home + setup screens** — start screen; players setup (3–15). — MISSING
- [ ] **Pass-and-play word reveal (`pass`)** — everyone privately sees the secret
  word except the spy, who must bluff. — MISSING
- [ ] **Interrogation (`pre-inter` / `inter`)** — question rounds aimed at the
  suspect; the spy finally states a guess for the word out loud. — MISSING
- [ ] **Judgement (`reveal`)** — the team rules on the spy's guess: was it right or
  wrong? — MISSING
- [ ] **Final + play again (`final` / `again`)** — results screen and rematch. — MISSING

## 19. Inside the game — Paint Followers (React app; draw-and-bluff game)

- [ ] **Setup screen** — players setup (3–15). — MISSING
- [ ] **Role reveal (`roleReveal`)** — pass-and-play: every player sees the secret
  word except one, who is told to "pretend you know the word!". — MISSING
- [ ] **Drawing phase (`drawing`)** — shared canvas; each player adds to the drawing
  in turn with brush, colour palette and stroke-width controls. — MISSING
- [ ] **Voting (`voting`)** — "who do you think doesn't know the word?" vote. — MISSING
- [ ] **Resolution (`resolution`)** — reveal: "<name> guessed right! the word is…"
  or "Wrong — the word was…". — MISSING
- [ ] **Scoreboard** — "see the points" results table. — MISSING

## 20. Inside the game — Sowl wla Dir? (single-file truth-or-dare game)

- [ ] **Home screen** — background art, title, start. — MISSING
- [ ] **Setup** — name input + players list (3–8 players). — MISSING
- [ ] **Roulette** — a spinner picks the player (and the round type) each turn. — MISSING
- [ ] **Choice screen** — the picked player chooses: **Sowl** (answer a question) or
  **Dir** (do a dare). — MISSING
- [ ] **Card + scoring** — the question/dare card is shown; completing it scores,
  failing it is marked with the "done — +0" button. — MISSING
- [ ] **End screen** — "Game over!" with the winner announced. — MISSING
- [ ] **End options** — play again, change players, back to the lobby. — MISSING
- [ ] **Quit button + quit-confirm modal** — exit / keep playing. — MISSING
- [ ] **In-game ad slot** — fixed ad slot rendered inside the game page. — MISSING

## 21. Shared in-game roster script (`public/game-files/_roster.v1.js`)

- [ ] **Roster application** — loaded by the single-file and React games; applies the
  roster names passed by the host and posts `roster-applied` back. — MISSING

## 22. Contact, legal pages & footer

- [ ] **Contact page** — "Contact us" heading; support email
  (support@playm3ana.ma, mailto link); three topic cards: general email, report
  cheating or a bug, partnerships & advertising. — MISSING
- [ ] **Privacy page** — 5 sections: what data is collected, where it is stored,
  advertising, your rights, children — plus a link to the contact page. — MISSING
- [ ] **Terms page** — 5 sections: coins & the economy, prohibited behaviour
  (including spam / chat abuse), penalties, external games, changes. — MISSING
- [ ] **Lobby footer** — brand + links to Privacy / Terms / Contact. — PARTIAL
  (playful lobby footer has the links; store lobby footer is minimal)

## 23. Admin (exists in the real game — EXCLUDED from the redesign)

- [ ] **/admin/login** — email + password form for admins. — EXISTS (out of scope)
- [ ] **/admin dashboard** — supervision panel, player management (user list, grant
  coins), back-to-lobby link. — EXISTS (out of scope)

## 24. API routes (names/purpose only — no user-facing design)

Auth: `auth/[...nextauth]`, `auth/register` · Player: `me`, `me/name`, `me/password`,
`profile/[username]` · Economy: `economy/balance`, `economy/ledger` · Games:
`games/unlock`, `games/verify-token` · Ads: `ads/start`, `ads/complete`, `ads/postback`
· Rewards: `rewards/checkin`, `rewards/claim`, `rewards/missions` · Social: `friends`,
`friends/[id]`, `friends/plays`, `leaderboard` · Sessions: `sessions/start`,
`sessions/submit`, `sessions/verify` · System: `devices/track` · Admin: `admin/grant`,
`admin/users`. (26 routes)

---

## Coverage summary (2026-11-03, Store Posters track)

| Area | Functions | DONE | PARTIAL | MISSING |
|---|---|---|---|---|
| 0. Global shell | 7 | 1 | 2 | 4 |
| 1. Lobby header/status | 6 | 0 | 4 | 2 |
| 2. Hero & ticker | 4 | 0 | 3 | 1 |
| 3. Games section | 9 | 3 | 3 | 3 |
| 4. Unlock & ad flows | 8 | 0 | 1 | 7 |
| 5. Check-in & rewards | 2 | 0 | 2 | 0 |
| 6. Missions | 7 | 0 | 1 | 6 |
| 7. Friends | 6 | 0 | 1 | 5 |
| 8. Referral panel | 1 | 0 | 1 | 0 |
| 9. Settings sheet | 9 | 0 | 0 | 9 |
| 10. Nav / toasts / guest sheet | 4 | 0 | 1 | 3 |
| 11. Login | 8 | 6 | 1 | 1 |
| 12. Register | 9 | 2 | 6 | 1 |
| 13. Auth callback | 1 | 0 | 0 | 1 |
| 14. Profile | 12 | 8 | 2 | 2 |
| 15. Game host page | 9 | 0 | 0 | 9 |
| 16. Inside Mafia | 7 | 0 | 0 | 7 |
| 17. Inside Bara Salfa | 12 | 0 | 0 | 12 |
| 18. Inside 7azr Fazr | 5 | 0 | 0 | 5 |
| 19. Inside Paint Followers | 6 | 0 | 0 | 6 |
| 20. Inside Sowl wla Dir | 9 | 0 | 0 | 9 |
| 21. Roster script | 1 | 0 | 0 | 1 |
| 22. Contact / legal / footer | 4 | 0 | 1 | 3 |
| **Total** | **146** | **20** | **29** | **97** |

**Redesign coverage = (20 DONE + 29 × 0.5 PARTIAL) / 146 ≈ 24 %.**
Admin (§23) is excluded from the count. The single biggest block is everything
inside the games + the game host page: **49 functions, all MISSING**.
