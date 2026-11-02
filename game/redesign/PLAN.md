# PLAYM3ANA — Redesign plan (adult-playful)

Style picked by Omar (2026-11-03): playful style, adult version — vivid purple → coral
gradient, chunky rounded 3D cards, confetti, Baloo 2 / Nunito type, gold coins.
Same functions as the real game (nerase.com / `lkiwan/loby`). Nothing invented, nothing removed.

## Phone sizing rules (every page)
- Page = one `.phone` shell: width 100%, max 430px, height exactly `100dvh` (the real screen).
- Safe-area insets respected (notch + home bar). Content scrolls inside `.scroll` only.
- Bottom tab bar always visible, never covered. Checked at 390×844 and 360×740 before push.

## Every page in the real game (audited 2026-11-03 from the repo)
| # | Real page / part | Route | Redesign step |
|---|---|---|---|
| 1 | Splash / loading gate (SplashGate) + logo | boot | **Step 1 — DONE** `loading.html` |
| 2 | Lobby / home (hero, ticker, featured Mafia, game grid, missions teaser, leaderboard teaser, referral, footer) | `/` | **Step 2 — DONE** `lobby.html` |
| 3 | Login (username or Gmail + password, Google/Gmail only, banned/frozen states, `?play=` return) | `/login` | **Step 3 — DONE** `login.html` |
| 4 | Register (username 3–20 `[a-z0-9_]`, email, no temp-mail, password 6+, confirm, referral code → +50 coins, signup grant) | `/register` | **Step 4 — DONE** `register.html` |
| 5 | Profile (avatar/character, display name, change name + password, referral code, log out) | `/profile` | **Step 5 — DONE** `profile.html` |
| 6 | Wallet (coin balance + ledger) | `/profile/wallet` | **Step 5 — DONE** (Wallet tab in `profile.html`) |
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
