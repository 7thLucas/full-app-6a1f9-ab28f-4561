import { Play, Home } from "lucide-react";

interface PauseOverlayProps {
  onResume: () => void;
  onHome: () => void;
  primaryColor: string;
  surfaceColor: string;
  textPrimary: string;
  textSecondary: string;
}

export function PauseOverlay({
  onResume,
  onHome,
  primaryColor,
  surfaceColor,
  textPrimary,
  textSecondary,
}: PauseOverlayProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative z-10 rounded-3xl p-8 flex flex-col items-center gap-5 shadow-2xl max-w-xs w-full"
        style={{ background: surfaceColor }}
      >
        <div className="text-5xl">⏸️</div>
        <div className="text-center">
          <h2 className="text-2xl font-extrabold" style={{ color: textPrimary }}>
            Game Paused
          </h2>
          <p className="text-sm mt-1" style={{ color: textSecondary }}>
            Take a breath. The café waits.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onResume}
            className="flex items-center gap-2 justify-center py-3 rounded-2xl font-extrabold transition-all active:scale-95 shadow-md"
            style={{
              background: primaryColor,
              color: "#fff",
              boxShadow: `0 4px 12px ${primaryColor}66`,
            }}
          >
            <Play size={18} />
            Continue
          </button>
          <button
            onClick={onHome}
            className="flex items-center gap-2 justify-center py-3 rounded-2xl font-bold transition-all active:scale-95"
            style={{
              background: "rgba(0,0,0,0.08)",
              color: textPrimary,
            }}
          >
            <Home size={16} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
