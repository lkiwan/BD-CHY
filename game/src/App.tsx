import { useState } from "react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  CheckCircle2,
  Chrome,
  Circle,
  Eye,
  EyeOff,
  Github,
  Loader2,
} from "lucide-react";

/*
  PLAYM3ANA (Loby) — "Aurora Sign Up" style registration.
  Design: the Aurora two-column template (MotionSites style).
  Functions: copied 1:1 from Loby's real register/login —
    · username: 3–20 chars, lowercase letters / numbers / _ only
    · email: required, valid format, temporary-email domains blocked
    · password: minimum 6 characters, must match the confirmation
    · referral code: optional — the referrer receives a +50 coin bonus
    · on success the account is created via POST /api/auth/register,
      the signup coin grant is credited, the user is auto signed-in
      and redirected to the lobby (mirrors src/app/register/page.tsx)
  Social: Loby only really supports Google (Gmail addresses only).
  The Github button is part of the Aurora template design and has
  no backend in Loby.
*/

const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

const TEMP_EMAIL_DOMAINS = [
  "tempmail.com", "10minutemail.com", "guerrillamail.com", "mailinator.com",
  "throwaway.email", "fakeinbox.com", "temp-mail.org", "yopmail.com",
  "trashmail.com", "getnada.com", "maildrop.cc", "dispostable.com",
  "tempail.com", "emailondeck.com", "mintemail.com", "spamgourmet.com",
  "findize.com",
];

function isTempEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return !!domain && TEMP_EMAIL_DOMAINS.includes(domain);
}

const heroContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function App() {
  const [username, setUsername] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);

    // — Loby register validation (src/app/register/page.tsx) —
    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      setError("Username needs 3–20 characters: lowercase letters, numbers or _ only.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError("A valid email is required (e.g. name@example.com).");
      return;
    }
    if (isTempEmail(email)) {
      setError("Temporary emails are not accepted. Use a real email.");
      return;
    }
    if (password.length < 6) {
      setError("Password needs at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Password and its confirmation do not match.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
        referralCode: referralCode.trim() || undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Registration failed, try again.");
      setLoading(false);
      return;
    }

    // Server also: bcrypt-hashes the password, blocks duplicate
    // username/email, generates the user's own referral code,
    // credits the signup coin grant, gives the referrer +50 coins.
    setSuccess(true);
    setLoading(false);
    // In Loby the user is then auto signed-in (signIn "credentials")
    // and redirected to the lobby after ~1.2s.
  };

  const handleGoogleRegister = () => {
    // Loby: signIn("google", { callbackUrl: "/" }) — Gmail only.
    setError(null);
  };

  return (
    <main className="flex min-h-screen w-full bg-black selection:bg-white/30 p-2 transition-all duration-500 lg:h-screen lg:overflow-hidden lg:p-4">
      {/* ── Left Column (Hero & Background Video) ─────────────────── */}
      <section className="relative hidden w-[52%] flex-col items-center justify-end pb-32 px-12 rounded-3xl overflow-hidden shadow-2xl h-full lg:flex">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4"
            type="video/mp4"
          />
        </video>

        <motion.div
          className="relative z-10 w-full max-w-xs space-y-8"
          variants={heroContainer}
          initial="hidden"
          animate="show"
        >
          {/* Game logo — same style as the Aurora logo:
              filled Circle icon + wordmark */}
          <motion.div variants={heroItem} className="flex items-center gap-2">
            <Circle className="fill-white text-white" />
            <span className="text-xl font-semibold tracking-tight">
              PLAYM3ANA
            </span>
          </motion.div>

          <motion.div variants={heroItem} className="space-y-3 text-center">
            <h1 className="text-4xl font-medium tracking-tight whitespace-nowrap">
              Join PLAYM3ANA
            </h1>
            <p className="text-white/60 text-sm leading-relaxed px-4">
              Follow these 3 quick phases to activate your space.
            </p>
          </motion.div>

          <motion.div variants={heroItem} className="space-y-3">
            <StepItem number={1} text="Register your identity" active />
            <StepItem number={2} text="Claim your welcome coins" />
            <StepItem number={3} text="Enter the lobby & play" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Right Column (Sign Up Form) ───────────────────────────── */}
      <section className="flex-1 flex flex-col items-center justify-center py-12 lg:py-6 px-4 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto lg:overflow-hidden">
        <motion.div
          className="w-full max-w-xl space-y-8 lg:space-y-6 sm:space-y-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Mobile brand (left column is hidden below lg) */}
          <div className="flex items-center gap-2 lg:hidden">
            <Circle className="fill-white text-white" />
            <span className="text-xl font-semibold tracking-tight">
              PLAYM3ANA
            </span>
          </div>

          {success ? (
            <div className="flex flex-col items-center py-6 text-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-400" />
              <h2 className="mt-5 text-3xl font-medium tracking-tight">
                Account created!
              </h2>
              <p className="mt-2 text-sm text-white/40">
                Your welcome coins are in. Signing you in and taking you
                to the lobby…
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <h2 className="text-3xl font-medium tracking-tight">
                  Create New Profile
                </h2>
                <p className="text-white/40 text-sm">
                  Input your basic details to begin the journey.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SocialButton icon={<Chrome />} label="Google" onClick={handleGoogleRegister} />
                <SocialButton icon={<Github />} label="Github" />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black px-4 text-xs font-medium text-white/40 uppercase tracking-widest">
                    Or
                  </span>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-950/60 px-3.5 py-3 text-sm font-medium text-red-200">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleRegister}>
                {/* Aurora's 2-column name row, mapped to Loby's real
                    fields: username + optional referral code */}
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup
                    label="Username"
                    placeholder="e.g. omar_07"
                    type="text"
                    value={username}
                    onChange={(v) => setUsername(v.toLowerCase())}
                  />
                  <InputGroup
                    label="Referral Code (optional)"
                    placeholder="Friend's code"
                    type="text"
                    value={referralCode}
                    onChange={setReferralCode}
                  />
                </div>

                <InputGroup
                  label="Email"
                  placeholder="name@gmail.com"
                  type="email"
                  value={email}
                  onChange={(v) => setEmail(v.toLowerCase())}
                />

                <div className="space-y-2">
                  <InputGroup
                    label="Password"
                    placeholder="••••••••"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={setPassword}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="text-white/40 transition hover:text-white"
                        aria-label={showPw ? "Hide password" : "Show password"}
                      >
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    }
                  />
                  {/* Loby's real rule is 6+ (the Aurora template said 8) */}
                  <p className="text-xs text-white/30">
                    Requires at least 6 symbols.
                  </p>
                </div>

                <InputGroup
                  label="Confirm Password"
                  placeholder="••••••••"
                  type={showPw ? "text" : "password"}
                  value={confirm}
                  onChange={setConfirm}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] mt-4 flex items-center justify-center gap-2 transition"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : null}
                  Create Account
                </button>
              </form>

              <p className="text-center text-sm text-white/40">
                Member of the team?{" "}
                <a href="/login" className="text-white hover:underline">
                  Log in
                </a>
              </p>
            </>
          )}
        </motion.div>
      </section>
    </main>
  );
}

/* ── Reusable components ─────────────────────────────────────────── */

function StepItem({
  number,
  text,
  active = false,
}: {
  number: number;
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-full p-2 pr-6 ${
        active
          ? "bg-white text-black border border-white"
          : "bg-brand-gray text-white border-none"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
          active ? "bg-black text-white" : "bg-white/10 text-white/40"
        }`}
      >
        {number}
      </span>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

function SocialButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 items-center justify-center gap-2 bg-black border border-white/10 rounded-xl hover:bg-white/5 transition"
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function InputGroup({
  label,
  placeholder,
  type,
  value,
  onChange,
  rightIcon,
}: {
  label: string;
  placeholder: string;
  type: string;
  value?: string;
  onChange?: (value: string) => void;
  rightIcon?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white">{label}</label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-brand-gray border-none rounded-xl h-11 px-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 focus:outline-none"
        />
        {rightIcon ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightIcon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
