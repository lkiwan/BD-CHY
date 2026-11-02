# PLAYM3ANA — Aurora-style Sign Up (`/game`)

Preview: **https://lkiwan.github.io/BD-CHY/game/**

The Aurora two-column registration design (MotionSites style), rebuilt for
PLAYM3ANA / Loby: same design, same logo style (filled circle + wordmark),
and **Loby's real login & registration functions** — only the skin changed.

## Files

| File | What it is |
|---|---|
| `index.html` | Standalone preview page (no build). Register + Login views, client-side validation with Loby's exact rules. |
| `src/App.tsx` | The React source, exactly as specified: React + Tailwind CSS v4 + `motion/react` + `lucide-react`, `export default function App()`, with `StepItem` / `SocialButton` / `InputGroup` at the bottom. |
| `src/index.css` | Inter font (300–700), `--font-sans`, `--color-brand-gray: #1A1A1A`, body `font-sans bg-black text-white antialiased`. |

## Design (from the Aurora spec)

- Two columns: left hero `w-[52%]`, hidden below `lg`; right form column.
- Left: background video (exact CloudFront MP4 from the spec), **no overlay /
  gradient / tint**, staggered fade-up content, logo = filled `Circle` icon +
  **PLAYM3ANA** wordmark (the Aurora logo style, for the game), heading
  “Join PLAYM3ANA”, 3 steps: *Register your identity → Claim your welcome
  coins → Enter the lobby & play*.
- Right: “Create New Profile”, Google + Github social buttons, “Or” divider,
  form, white `Create Account` button (`h-14`), “Member of the team? Log in”.
- One adaptation: Aurora's First/Last Name row is mapped to Loby's real top
  fields — **Username** + **Referral Code (optional)** — because Loby has no
  first/last name. The password helper follows Loby's real rule (6+, the
  template said 8).

## Loby functions carried over (checked in `lkiwan/loby`, 2026-11-02)

**Register** (`src/app/register/page.tsx` + `POST /api/auth/register`):
username 3–20 chars `[a-z0-9_]` · email required + format-checked ·
temporary-email domains blocked (17 domains) · password ≥ 6 + confirmation
match · eye show/hide toggle · optional referral code (referrer gets **+50
coins**, new user gets his own generated referral code) · server: rate limit
5/hour/IP, bcrypt (10 rounds), duplicate username/email rejected, **signup
coin grant** credited, signup event logged · success screen → auto sign-in →
redirect to lobby (or `/login` if auto sign-in fails).

**Login** (`src/app/login/page.tsx` + NextAuth options): username **or**
email/Gmail + password, case-insensitive · banned accounts →
`account_banned`, frozen → `account_frozen` · Google sign-in, **Gmail only**
(`@gmail.com`; a new Google user is auto-created with the signup grant + a
referral code) · after login: back to the lobby, straight into a game when
the link carries `?play=<game>&method=coins|ad`, and `/admin` for ADMIN
role · JWT session carries id, username, displayName, coins, role.

**Not in Loby:** Github login — it exists in the Aurora template design
only, so the button is shown for design fidelity and labelled as such.
