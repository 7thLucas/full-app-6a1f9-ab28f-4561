import type { CustomerOrder, MenuItem, OrderItem, PrepStation as PrepStationType } from "~/game/types/game.types";

interface PrepStationPanelProps {
  station: PrepStationType;
  activeOrders: CustomerOrder[];
  prepQueue: OrderItem[];
  playerHandItem: OrderItem | null;
  onPrepare: (orderId: string, itemIndex: number) => void;
  onPickUp: (orderId: string, itemId: string) => void;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceColor: string;
  textPrimary: string;
  textSecondary: string;
  successColor: string;
  warningColor: string;
}

export function PrepStationPanel({
  station,
  activeOrders,
  prepQueue,
  playerHandItem,
  onPrepare,
  onPickUp,
  primaryColor,
  secondaryColor,
  accentColor,
  surfaceColor,
  textPrimary,
  textSecondary,
  successColor,
  warningColor,
}: PrepStationPanelProps) {
  // Find all items from active orders that match this station's category and are pending
  const pendingItems: Array<{ order: CustomerOrder; item: OrderItem; itemIndex: number }> = [];
  const preparingItems: OrderItem[] = [];
  const readyItems: OrderItem[] = [];

  for (const order of activeOrders) {
    order.items.forEach((item, idx) => {
      if (item.menuItem.category === station.category) {
        if (item.status === "pending") {
          pendingItems.push({ order, item, itemIndex: idx });
        }
      }
    });
  }

  for (const item of prepQueue) {
    if (item.menuItem.category === station.category) {
      if (item.status === "preparing") {
        preparingItems.push(item);
      } else if (item.status === "ready") {
        readyItems.push(item);
      }
    }
  }

  const hasActivity = preparingItems.length > 0 || readyItems.length > 0 || pendingItems.length > 0;

  return (
    <div
      className="rounded-2xl p-3 flex flex-col gap-2"
      style={{
        background: surfaceColor,
        border: `2px solid ${hasActivity ? primaryColor : "transparent"}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {/* Station header */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">{station.emoji}</span>
        <div>
          <div className="text-xs font-extrabold" style={{ color: textPrimary }}>
            {station.label}
          </div>
          <div className="text-xs" style={{ color: textSecondary }}>
            {station.category}
          </div>
        </div>
      </div>

      {/* Ready items — pick up */}
      {readyItems.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="text-xs font-bold" style={{ color: successColor }}>
            Ready to deliver!
          </div>
          {readyItems.map((item, idx) => (
            <button
              key={`${item.menuItem.id}-${idx}`}
              onClick={() => {
                // find orderId for this item
                const orderForItem = activeOrders.find((o) =>
                  o.items.some(
                    (it) => it.menuItem.id === item.menuItem.id && it.status === "ready"
                  )
                );
                if (orderForItem) {
                  onPickUp(orderForItem.id, item.menuItem.id);
                }
              }}
              disabled={!!playerHandItem}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
              style={{
                background: successColor,
                color: "#fff",
              }}
            >
              <span className="text-base">{item.menuItem.emoji}</span>
              <span>{item.menuItem.name}</span>
              <span className="ml-auto">Pick up →</span>
            </button>
          ))}
        </div>
      )}

      {/* Preparing items — progress */}
      {preparingItems.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="text-xs font-bold" style={{ color: warningColor }}>
            Preparing...
          </div>
          {preparingItems.map((item, idx) => (
            <div
              key={`${item.menuItem.id}-prep-${idx}`}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl text-xs font-semibold"
              style={{ background: `${warningColor}22`, color: textPrimary }}
            >
              <span className="text-base">{item.menuItem.emoji}</span>
              <span className="flex-1">{item.menuItem.name}</span>
              <span className="animate-spin text-sm">⏳</span>
            </div>
          ))}
        </div>
      )}

      {/* Pending items — start prep */}
      {pendingItems.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="text-xs font-bold" style={{ color: textSecondary }}>
            Queue ({pendingItems.length})
          </div>
          {pendingItems.slice(0, 3).map(({ order, item, itemIndex }, idx) => (
            <button
              key={`${order.id}-${itemIndex}-${idx}`}
              onClick={() => onPrepare(order.id, itemIndex)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95"
              style={{
                background: `${primaryColor}22`,
                color: textPrimary,
                border: `1.5px solid ${primaryColor}44`,
              }}
            >
              <span className="text-base">{item.menuItem.emoji}</span>
              <span className="flex-1">{item.menuItem.name}</span>
              <span style={{ color: primaryColor }}>Start →</span>
            </button>
          ))}
          {pendingItems.length > 3 && (
            <div className="text-xs text-center" style={{ color: textSecondary }}>
              +{pendingItems.length - 3} more
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!hasActivity && (
        <div
          className="text-xs text-center py-2 opacity-60"
          style={{ color: textSecondary }}
        >
          No orders yet
        </div>
      )}
    </div>
  );
}
