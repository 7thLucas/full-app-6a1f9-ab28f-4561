import { Clock, Star, Trophy, Pause, Play, Home } from "lucide-react";
import type { GamePhase } from "~/game/types/game.types";

interface GameHudProps {
  score: number;
  timeLeft: number;
  level: number;
  completedOrders: number;
  missedOrders: number;
  phase: GamePhase;
  onPause: () => void;
  onResume: () => void;
  onHome: () => void;
  primaryColor: string;
  secondaryColor: string;
  textPrimary: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function GameHud({
  score,
  timeLeft,
  level,
  completedOrders,
  missedOrders,
  phase,
  onPause,
  onResume,
  onHome,
  primaryColor,
  secondaryColor,
  textPrimary,
}: GameHudProps) {
  const isUrgent = timeLeft <= 20;
  const isPlaying = phase === "playing";
  const isPaused = phase === "paused";

  return (
    <div
      className="flex items-center justify-between px-4 py-2 shadow-md z-20 relative"
      style={{
        background: primaryColor,
        color: "#fff",
      }}
    >
      {/* Left — Level & Home */}
      <div className="flex items-center gap-2">
        <button
          onClick={onHome}
          className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
          title="Back to Home"
        >
          <Home size={18} />
        </button>
        <span className="text-sm font-bold opacity-90">Lvl {level}</span>
      </div>

      {/* Center — Score & Timer */}
      <div className="flex items-center gap-4">
        {/* Score */}
        <div className="flex items-center gap-1.5">
          <Trophy size={16} className="opacity-90" />
          <span className="text-lg font-extrabold tabular-nums">{score.toLocaleString()}</span>
        </div>

        {/* Timer */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-extrabold text-lg tabular-nums transition-all ${
            isUrgent ? "animate-pulse" : ""
          }`}
          style={{
            background: isUrgent ? "#EF5350" : "rgba(255,255,255,0.2)",
          }}
        >
          <Clock size={16} />
          {formatTime(timeLeft)}
        </div>

        {/* Stars / Completed */}
        <div className="flex items-center gap-1">
          <Star size={16} style={{ color: secondaryColor }} fill={secondaryColor} />
          <span className="text-sm font-bold">{completedOrders}</span>
        </div>
      </div>

      {/* Right — Pause/Resume */}
      <div className="flex items-center gap-2">
        <span className="text-xs opacity-75 hidden sm:inline">Missed: {missedOrders}</span>
        {isPlaying && (
          <button
            onClick={onPause}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            title="Pause"
          >
            <Pause size={18} />
          </button>
        )}
        {isPaused && (
          <button
            onClick={onResume}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            title="Resume"
          >
            <Play size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
