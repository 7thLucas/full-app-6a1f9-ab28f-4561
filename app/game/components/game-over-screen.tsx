import { Trophy, RotateCcw, Home } from "lucide-react";

interface GameOverScreenProps {
  score: number;
  completedOrders: number;
  missedOrders: number;
  level: number;
  isLevelComplete: boolean;
  onRestart: () => void;
  onHome: () => void;
  primaryColor: string;
  secondaryColor: string;
  successColor: string;
  textPrimary: string;
  textSecondary: string;
  surfaceColor: string;
}

export function GameOverScreen({
  score,
  completedOrders,
  missedOrders,
  level,
  isLevelComplete,
  onRestart,
  onHome,
  primaryColor,
  secondaryColor,
  successColor,
  textPrimary,
  textSecondary,
  surfaceColor,
}: GameOverScreenProps) {
  const stars = Math.min(3, Math.max(0, Math.ceil(completedOrders / 3)));

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-sm rounded-3xl p-6 flex flex-col items-center gap-5 shadow-2xl"
        style={{ background: surfaceColor }}
      >
        {/* Title */}
        <div className="text-center">
          <div className="text-4xl mb-2">{isLevelComplete ? "🎉" : "⏰"}</div>
          <h2
            className="text-2xl font-extrabold"
            style={{ color: textPrimary }}
          >
            {isLevelComplete ? "Level Complete!" : "Time's Up!"}
          </h2>
          <p className="text-sm mt-1" style={{ color: textSecondary }}>
            {isLevelComplete
              ? "Great work, café champion!"
              : "The café closes for the night."}
          </p>
        </div>

        {/* Stars */}
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className="text-4xl transition-all"
              style={{ opacity: s <= stars ? 1 : 0.25 }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Stats */}
        <div
          className="w-full rounded-2xl p-4 flex flex-col gap-2"
          style={{ background: "rgba(255,255,255,0.6)" }}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold" style={{ color: textSecondary }}>
              Score
            </span>
            <span className="text-xl font-extrabold tabular-nums" style={{ color: primaryColor }}>
              {score.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold" style={{ color: textSecondary }}>
              Orders completed
            </span>
            <span className="font-bold" style={{ color: successColor }}>
              {completedOrders}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold" style={{ color: textSecondary }}>
              Customers missed
            </span>
            <span className="font-bold" style={{ color: "#EF5350" }}>
              {missedOrders}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onHome}
            className="flex items-center gap-2 justify-center flex-1 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95"
            style={{
              background: "rgba(0,0,0,0.08)",
              color: textPrimary,
            }}
          >
            <Home size={16} />
            Home
          </button>
          <button
            onClick={onRestart}
            className="flex items-center gap-2 justify-center flex-1 py-3 rounded-2xl font-extrabold text-sm transition-all active:scale-95 shadow-md"
            style={{
              background: primaryColor,
              color: "#fff",
              boxShadow: `0 4px 12px ${primaryColor}66`,
            }}
          >
            <RotateCcw size={16} />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
