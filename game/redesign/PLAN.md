# PLAYM3ANA — Redesign plan (adult-playful)

Style picked by Omar (2026-11-03): playful style, adult version — vivid purple → coral
gradient, chunky rounded 3D cards, confetti, Baloo 2 / Nunito type, gold coins.
Same functions as the real game (nerase.com / `lkiwan/loby`). Nothing invented, nothing removed.

## Phone sizing rules (every page)
- Page = one `.phone` shell: width 100%, max 430px, height exactly `100dvh` (the real screen).
- Safe-area insets respected (notch + home bar). Content scrolls inside `.scroll` only.
- Bottom tab bar always visible, never covered. Checked at 390×844 and 360×740 before push.

## Verification rule (Omar's order, 2026-11-03)

**Every page: check the real content in the original game code FIRST** (`lkiwan/loby`),
then design. No invented sections, prices, or functions. Applied retroactively to Steps 1–5
(see "Corrections" below).

## Corrections from the 2026-11-03 real-content check

- **games.ts verified directly:** prices 25 / 20 / 15 / 15 / 15, players and durations as in
  the lobby — the lobby page was already right. Game icons fixed to the real ones
  (Mafia 💀, Bara Salfa 🤫, 7azr Fazr 🔍, Paint 🎨, Sowl ❓) and the lobby ticker now uses the
  game's real 7 ticker lines.
- **Profile rebuilt to the real `/profile/[username]` content:** letter avatar (first letter
  of the username), LEVEL + XP with "% to next level", 4 stats (coins / sessions / current
  streak / longest streak), referral code + copy ("you both win coins"), recent sessions
  (+XP, score), member-since. The first version wrongly had an animal character, a wallet
  tab and edit forms on this page.
- **No `/profile/wallet` page exists** in the current game — wallet step removed.
- **Change display name + change password live in the lobby Settings sheet** (with a name-
  change cooldown and current/new/confirm password fields) — not on the profile page.
- **Hero line:** the real animated hero is «فضح صاحبك قبل ما يفضحك» — the lobby's English
  line is its translation, kept.

## Every page in the real game (audited 2026-11-03 from the repo)
| # | Real page / part | Route | Redesign step |
|---|---|---|---|
| 1 | Splash / loading gate (SplashGate) + logo | boot | **Step 1 — DONE** `loading.html` |
| 2 | Lobby / home (hero, ticker, featured Mafia, game grid, missions teaser, leaderboard teaser, referral, footer) | `/` | **Step 2 — DONE** `lobby.html` |
| 3 | Login (username or Gmail + password, Google/Gmail only, banned/frozen states, `?play=` return) | `/login` | **Step 3 — DONE** `login.html` |
| 4 | Register (username 3–20 `[a-z0-9_]`, email, no temp-mail, password 6+, confirm, referral code → +50 coins, signup grant) | `/register` | **Step 4 — DONE** `register.html` |
| 5 | Profile — real content: letter avatar, username, level/XP bar, 4 stats, referral code + copy, recent sessions, member-since | `/profile/[username]` | **Step 5 — DONE, rebuilt after real-content check** `profile.html` |
| 6 | ~~Wallet~~ — **no standalone wallet page exists in the current game** (coins show in the lobby pill + profile stats) | — | REMOVED |
| 7 | Missions + daily check-in / streaks | `/missions` | Step 6 — NEXT `missions.html` |
| 8 | Leaderboard | `/leaderboard` | Step 7 `leaderboard.html` |
| 9 | Friends panel + saved roster | lobby component | inside Steps 2 + 5 |
| 10 | Game page (unlock: pay coins OR watch ad → token) ×5: Mafia 25c, Bara Salfa 20c, 7azr Fazr 15c, Paint Followers 15c, Sowl wla Dir 15c | `/games/[gameId]` | Step 8 `game-mafia.html` first, then the other 4 |
| 11 | Win / result page | `/play/win` | Step 8b `win.html` |
| 12 | Contact | `/contact` | Step 9 `contact.html` |
| 13 | Privacy / Terms | `/privacy` `/terms` | Step 9 `legal.html` |
| — | Admin (`/admin`, `/admin/users`) | owner-only | not part of the player redesign |
| — | Auth error page | `/auth/error` | small state inside login step |

Note on "characters": the real game has no separate characters page — the character is the
profile avatar. Step 5 designs the profile + avatar/character area.

Correction (2026-11-03): an earlier draft of this plan listed a "name gate + onboarding tour"
step. Re-checking the actual repo (`src/components` + code search) shows **no NameGate and no
OnboardingTour exist in the real game** — that step was removed and the profile moved up to Step 5.

## Order of work
One page at a time: build → screenshot-check at phone sizes → push online → Omar checks → next page.
Check hub: `index.html` in this folder lists every page and its status.
