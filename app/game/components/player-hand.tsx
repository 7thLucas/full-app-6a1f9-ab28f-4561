import type { OrderItem } from "~/game/types/game.types";

interface PlayerHandProps {
  item: OrderItem | null;
  onDrop: () => void;
  primaryColor: string;
  accentColor: string;
}

export function PlayerHand({ item, onDrop, primaryColor, accentColor }: PlayerHandProps) {
  if (!item) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold"
        style={{
          background: "rgba(255,255,255,0.5)",
          border: "2px dashed rgba(0,0,0,0.15)",
          color: "rgba(0,0,0,0.4)",
          minHeight: "52px",
        }}
      >
        <span>Your hands are empty</span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-4 py-2 shadow-md"
      style={{
        background: accentColor,
        color: "#fff",
        boxShadow: `0 4px 16px ${accentColor}66`,
      }}
    >
      <span className="text-2xl">{item.menuItem.emoji}</span>
      <div className="flex-1">
        <div className="text-xs font-bold opacity-80">Carrying</div>
        <div className="text-sm font-extrabold">{item.menuItem.name}</div>
      </div>
      <button
        onClick={onDrop}
        className="text-xs px-2 py-1 rounded-full font-bold hover:bg-white/20 transition-colors"
      >
        Drop
      </button>
    </div>
  );
}
