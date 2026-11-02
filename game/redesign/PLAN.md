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
| 4 | Register (username 3–20 `[a-z0-9_]`, email, no temp-mail, password 6+, confirm, referral code → +50 coins, signup grant) | `/register` | Step 4 — NEXT `register.html` |
| 5 | Name gate + onboarding tour (first-run) | NameGate / OnboardingTour | Step 5 `welcome.html` |
| 6 | Profile (avatar/character, display name, change name + password) | `/profile` | Step 6 `profile.html` |
| 7 | Wallet (coin balance + ledger) | `/profile/wallet` | Step 6b `wallet.html` |
| 8 | Missions + daily check-in / streaks | `/missions` | Step 7 `missions.html` |
| 9 | Leaderboard | `/leaderboard` | Step 8 `leaderboard.html` |
| 10 | Friends panel + saved roster | lobby component | inside Steps 2 + 6 |
| 11 | Game page (unlock: pay coins OR watch ad → token) ×5: Mafia 25c, Bara Salfa 20c, 7azr Fazr 15c, Paint Followers 15c, Sowl wla Dir 15c | `/games/[gameId]` | Step 9 `game-mafia.html` first, then the other 4 |
| 12 | Win / result page | `/play/win` | Step 10 `win.html` |
| 13 | Contact | `/contact` | Step 11 `contact.html` |
| 14 | Privacy / Terms | `/privacy` `/terms` | Step 11 `legal.html` |
| — | Admin (`/admin`, `/admin/users`) | owner-only | not part of the player redesign |
| — | Auth error page | `/auth/error` | small state inside login step |

Note on "characters": the real game has no separate characters page — the character is the
profile avatar. Step 6 designs the profile + avatar/character area.

## Order of work
One page at a time: build → screenshot-check at phone sizes → push online → Omar checks → next page.
Check hub: `index.html` in this folder lists every page and its status.
