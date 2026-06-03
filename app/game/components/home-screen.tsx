import { Play } from "lucide-react";

interface HomeScreenProps {
  appName: string;
  tagline: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  playButtonLabel: string;
  logoUrl: string;
  heroImageUrl?: string;
  onPlay: () => void;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textPrimary: string;
  textSecondary: string;
}

const FOOD_EMOJIS = ["☕", "🍔", "🥐", "🍰", "🧋", "🥗", "🍝", "🧁", "🍦", "🥤"];

export function HomeScreen({
  appName,
  tagline,
  welcomeTitle,
  welcomeSubtitle,
  playButtonLabel,
  logoUrl,
  heroImageUrl,
  onPlay,
  primaryColor,
  secondaryColor,
  accentColor,
  backgroundColor,
  surfaceColor,
  textPrimary,
  textSecondary,
}: HomeScreenProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 py-8"
      style={{ background: backgroundColor }}
    >
      {/* Decorative floating food emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
        {FOOD_EMOJIS.map((emoji, i) => (
          <span
            key={i}
            className="absolute text-3xl opacity-10 animate-bounce"
            style={{
              left: `${(i * 11 + 5) % 95}%`,
              top: `${(i * 17 + 8) % 90}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + (i % 3) * 0.5}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-sm w-full text-center">
        {/* Logo / App name */}
        <div className="flex flex-col items-center gap-3">
          {logoUrl && !logoUrl.includes("FILL_LOGO") ? (
            <img
              src={logoUrl}
              alt={appName}
              className="h-20 w-20 object-contain rounded-2xl shadow-lg"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              }}
            >
              ☕
            </div>
          )}

          <div>
            <h1
              className="text-4xl font-extrabold tracking-tight"
              style={{ color: primaryColor }}
            >
              {appName}
            </h1>
            <p className="text-base font-semibold mt-1" style={{ color: secondaryColor }}>
              {tagline}
            </p>
          </div>
        </div>

        {/* Hero image */}
        {heroImageUrl && (
          <div className="w-full rounded-3xl overflow-hidden shadow-xl">
            <img
              src={heroImageUrl}
              alt="Cafe Dash gameplay"
              className="w-full object-cover max-h-48"
            />
          </div>
        )}

        {/* Welcome card */}
        <div
          className="w-full rounded-3xl p-5 shadow-md"
          style={{
            background: surfaceColor,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            className="text-xl font-extrabold mb-2"
            style={{ color: textPrimary }}
          >
            {welcomeTitle}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: textSecondary }}>
            {welcomeSubtitle}
          </p>

          {/* How to play */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { icon: "📋", label: "Take Orders" },
              { icon: "🍳", label: "Prep Food" },
              { icon: "🚶", label: "Deliver It" },
              { icon: "✨", label: "Earn Stars" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{ background: "rgba(255,255,255,0.7)" }}
              >
                <span className="text-xl">{icon}</span>
                <span className="text-xs font-bold" style={{ color: textPrimary }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Play button */}
        <button
          onClick={onPlay}
          className="flex items-center gap-3 justify-center w-full py-4 rounded-full font-extrabold text-xl text-white transition-all active:scale-95 hover:scale-105 shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            boxShadow: `0 6px 24px ${primaryColor}66`,
          }}
        >
          <Play size={22} fill="white" />
          {playButtonLabel}
        </button>

        {/* Footer hint */}
        <p className="text-xs opacity-60" style={{ color: textSecondary }}>
          Tap tables to seat customers. Prep food. Deliver before time runs out!
        </p>
      </div>
    </div>
  );
}
