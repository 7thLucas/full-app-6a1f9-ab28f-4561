import type { Table } from "~/game/types/game.types";

interface TableCardProps {
  table: Table;
  isSelected: boolean;
  hasItemInHand: boolean;
  onSelect: (tableId: number) => void;
  onDeliver: (tableId: number) => void;
  primaryColor: string;
  surfaceColor: string;
  textPrimary: string;
  textSecondary: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
}

const moodEmoji: Record<string, string> = {
  happy: "😊",
  neutral: "😐",
  impatient: "😤",
  angry: "😡",
};

export function TableCard({
  table,
  isSelected,
  hasItemInHand,
  onSelect,
  onDeliver,
  primaryColor,
  surfaceColor,
  textPrimary,
  textSecondary,
  successColor,
  warningColor,
  errorColor,
}: TableCardProps) {
  const isEmpty = table.status === "empty";
  const isDone = table.status === "done";
  const isOccupied = table.status === "occupied" || table.status === "waiting_delivery";

  const handleClick = () => {
    if (hasItemInHand && isOccupied) {
      onDeliver(table.id);
    } else {
      onSelect(table.id);
    }
  };

  const pendingItems = table.order?.items.filter((it) => it.status === "pending") ?? [];
  const readyItems = table.order?.items.filter((it) => it.status === "ready") ?? [];
  const deliveredItems = table.order?.items.filter((it) => it.status === "delivered") ?? [];
  const mood = table.order?.mood ?? "happy";

  // Patience bar — drains from full to empty over the customer's patience
  // window. Color shifts green → yellow → red as urgency rises.
  const patienceTotal = table.order?.patience ?? 0;
  const patienceLeft = table.order?.patienceRemaining ?? 0;
  const patiencePct =
    patienceTotal > 0
      ? Math.max(0, Math.min(100, (patienceLeft / patienceTotal) * 100))
      : 0;
  let patienceBarColor = successColor;
  if (patiencePct < 25) patienceBarColor = errorColor;
  else if (patiencePct < 50) patienceBarColor = warningColor;

  let borderColor = surfaceColor;
  if (isSelected) borderColor = primaryColor;
  if (hasItemInHand && isOccupied) borderColor = successColor;
  if (isDone) borderColor = successColor;

  return (
    <button
      onClick={handleClick}
      className="relative rounded-2xl p-3 text-left transition-all duration-200 flex flex-col gap-2 min-h-[120px] active:scale-95"
      style={{
        background: isEmpty ? "rgba(255,255,255,0.4)" : surfaceColor,
        border: `2.5px solid ${borderColor}`,
        boxShadow: isSelected
          ? `0 4px 16px ${primaryColor}44`
          : "0 2px 8px rgba(0,0,0,0.08)",
        opacity: isEmpty ? 0.6 : 1,
      }}
    >
      {/* Table number */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            background: primaryColor,
            color: "#fff",
          }}
        >
          Table {table.id}
        </span>

        {/* Mood indicator */}
        {isOccupied && (
          <span className="text-xl" title={mood}>
            {moodEmoji[mood]}
          </span>
        )}
        {isDone && <span className="text-xl">✅</span>}
        {isEmpty && <span className="text-lg opacity-40">🪑</span>}
      </div>

      {/* Patience bar — visible only while a customer is waiting. */}
      {isOccupied && table.order && (
        <div
          className="relative h-2 w-full rounded-full overflow-hidden"
          style={{ background: "rgba(0,0,0,0.12)" }}
          aria-label={`Patience: ${Math.round(patiencePct)}%`}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(patiencePct)}
        >
          <div
            className="h-full rounded-full transition-[width,background-color] duration-200 ease-linear"
            style={{
              width: `${patiencePct}%`,
              background: patienceBarColor,
              boxShadow:
                patiencePct < 25
                  ? `0 0 8px ${patienceBarColor}`
                  : undefined,
            }}
          />
        </div>
      )}

      {/* Customer emoji */}
      {table.customerEmoji && !isDone && (
        <div className="flex items-center gap-2">
          <span className="text-2xl">{table.customerEmoji}</span>
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            {table.order?.items.map((item, idx) => {
              let itemColor = textSecondary;
              let badge = "⏳";
              if (item.status === "preparing") { itemColor = warningColor; badge = "🔄"; }
              if (item.status === "ready") { itemColor = successColor; badge = "✅"; }
              if (item.status === "delivered") { itemColor = successColor; badge = "🍽️"; }

              return (
                <div
                  key={idx}
                  className="flex items-center gap-1 text-xs font-semibold truncate"
                  style={{ color: itemColor }}
                >
                  <span>{badge}</span>
                  <span>{item.menuItem.emoji} {item.menuItem.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty table placeholder */}
      {isEmpty && (
        <div
          className="text-center text-xs font-semibold flex-1 flex items-center justify-center"
          style={{ color: textSecondary }}
        >
          Waiting for guests...
        </div>
      )}

      {/* Done indicator */}
      {isDone && (
        <div
          className="text-center text-xs font-bold"
          style={{ color: successColor }}
        >
          Clearing table...
        </div>
      )}

      {/* Deliver hint */}
      {hasItemInHand && isOccupied && (
        <div
          className="absolute inset-0 rounded-2xl flex items-center justify-center text-xs font-bold"
          style={{
            background: `${successColor}22`,
            border: `2.5px dashed ${successColor}`,
            color: successColor,
          }}
        >
          Tap to Deliver!
        </div>
      )}
    </button>
  );
}
