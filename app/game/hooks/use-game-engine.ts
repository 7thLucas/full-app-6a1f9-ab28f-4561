import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CustomerOrder,
  GamePhase,
  GameState,
  MenuItem,
  OrderItem,
  OrderStatus,
  PrepStation,
  Table,
} from "~/game/types/game.types";
import { getLevelConfig, type LevelConfig } from "~/game/config/levelConfigs";

const CUSTOMER_EMOJIS = ["👩", "👨", "🧑", "👧", "👦", "🧔", "👴", "👵", "🧕", "👲"];

let _orderIdCounter = 0;
let _customerIdCounter = 0;

function genOrderId() {
  return `order-${++_orderIdCounter}-${Date.now()}`;
}
function genCustomerId() {
  return `cust-${++_customerIdCounter}`;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildInitialTables(numTables: number): Table[] {
  return Array.from({ length: numTables }, (_, i) => ({
    id: i + 1,
    status: "empty" as const,
  }));
}

export const PREP_STATIONS: PrepStation[] = [
  {
    id: "drinks",
    category: "drink",
    label: "Drinks Bar",
    emoji: "🍹",
    items: [],
  },
  {
    id: "kitchen",
    category: "food",
    label: "Kitchen",
    emoji: "🍳",
    items: [],
  },
  {
    id: "desserts",
    category: "dessert",
    label: "Desserts",
    emoji: "🍰",
    items: [],
  },
];

export function buildPrepStations(menuItems: MenuItem[]): PrepStation[] {
  return PREP_STATIONS.map((station) => ({
    ...station,
    items: menuItems.filter((item) => item.category === station.category),
  }));
}

interface UseGameEngineOptions {
  numTables: number;
  levelDurationSeconds: number;
  maxCustomers: number;
  pointsPerDelivery: number;
  menuItems: MenuItem[];
}

export function useGameEngine(options: UseGameEngineOptions) {
  const {
    numTables,
    levelDurationSeconds,
    maxCustomers,
    pointsPerDelivery,
    menuItems,
  } = options;

  const [state, setState] = useState<GameState>({
    phase: "home",
    level: 1,
    score: 0,
    timeLeft: levelDurationSeconds,
    tables: buildInitialTables(numTables),
    activeOrders: [],
    prepQueue: [],
    completedOrders: 0,
    missedOrders: 0,
    selectedTableId: null,
    playerHandItem: null,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const customerSpawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const moodTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalCustomersSpawnedRef = useRef(0);
  // Active level config — single source of truth for difficulty per level.
  const levelConfigRef = useRef<LevelConfig>(getLevelConfig(1));
  const [levelConfig, setLevelConfig] = useState<LevelConfig>(() => getLevelConfig(1));

  const clearAllTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (customerSpawnRef.current) clearInterval(customerSpawnRef.current);
    if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    if (moodTimerRef.current) clearInterval(moodTimerRef.current);
    timerRef.current = null;
    customerSpawnRef.current = null;
    prepTimerRef.current = null;
    moodTimerRef.current = null;
  }, []);

  const startGame = useCallback((level = 1) => {
    clearAllTimers();
    totalCustomersSpawnedRef.current = 0;
    _orderIdCounter = 0;
    _customerIdCounter = 0;

    // Load the difficulty config for this level — patience, arrival rate,
    // and simultaneous-customer cap all come from here.
    const nextConfig = getLevelConfig(level);
    levelConfigRef.current = nextConfig;
    setLevelConfig(nextConfig);

    setState({
      phase: "playing",
      level,
      score: 0,
      timeLeft: levelDurationSeconds,
      tables: buildInitialTables(numTables),
      activeOrders: [],
      prepQueue: [],
      completedOrders: 0,
      missedOrders: 0,
      selectedTableId: null,
      playerHandItem: null,
    });
  }, [clearAllTimers, levelDurationSeconds, numTables]);

  const pauseGame = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== "playing") return prev;
      clearAllTimers();
      return { ...prev, phase: "paused" };
    });
  }, [clearAllTimers]);

  const resumeGame = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== "paused") return prev;
      return { ...prev, phase: "playing" };
    });
  }, []);

  const goHome = useCallback(() => {
    clearAllTimers();
    setState((prev) => ({ ...prev, phase: "home" }));
  }, [clearAllTimers]);

  // Spawn a customer at an empty table
  const spawnCustomer = useCallback(() => {
    if (menuItems.length === 0) return;

    setState((prev) => {
      if (prev.phase !== "playing") return prev;
      if (totalCustomersSpawnedRef.current >= maxCustomers) return prev;

      // Enforce the level's simultaneous-customer cap. Active = anyone
      // still sitting at a table waiting/eating, derived from tables.
      const activeCount = prev.tables.filter(
        (t) => t.status === "occupied" || t.status === "waiting_delivery"
      ).length;
      if (activeCount >= levelConfigRef.current.maxSimultaneousCustomers) {
        return prev;
      }

      const emptyTable = prev.tables.find((t) => t.status === "empty");
      if (!emptyTable) return prev;

      totalCustomersSpawnedRef.current++;

      const numItems = Math.floor(Math.random() * 2) + 1; // 1-2 items per order
      const selectedItems: MenuItem[] = [];
      for (let i = 0; i < numItems; i++) {
        selectedItems.push(pickRandom(menuItems));
      }

      // Patience window is config-driven, not hardcoded.
      const patienceSeconds = levelConfigRef.current.patienceTimerSeconds;

      const order: CustomerOrder = {
        id: genOrderId(),
        tableId: emptyTable.id,
        customerId: genCustomerId(),
        items: selectedItems.map((item) => ({
          menuItem: item,
          status: "pending" as OrderStatus,
        })),
        arrivedAt: Date.now(),
        patience: patienceSeconds,
        patienceRemaining: patienceSeconds,
        mood: "happy",
      };

      const updatedTables = prev.tables.map((t) =>
        t.id === emptyTable.id
          ? {
              ...t,
              status: "occupied" as const,
              order,
              customerEmoji: pickRandom(CUSTOMER_EMOJIS),
            }
          : t
      );

      return {
        ...prev,
        tables: updatedTables,
        activeOrders: [...prev.activeOrders, order],
      };
    });
  }, [menuItems, maxCustomers]);

  // Start preparing an item from a station
  const prepareItem = useCallback((orderId: string, itemIndex: number) => {
    setState((prev) => {
      const order = prev.activeOrders.find((o) => o.id === orderId);
      if (!order) return prev;

      const item = order.items[itemIndex];
      if (!item || item.status !== "pending") return prev;

      const updatedOrders = prev.activeOrders.map((o) => {
        if (o.id !== orderId) return o;
        const updatedItems = o.items.map((it, idx) => {
          if (idx !== itemIndex) return it;
          return { ...it, status: "preparing" as OrderStatus, prepStartedAt: Date.now() };
        });
        return { ...o, items: updatedItems };
      });

      const updatedItem: OrderItem = {
        ...item,
        status: "preparing",
        prepStartedAt: Date.now(),
      };

      return {
        ...prev,
        activeOrders: updatedOrders,
        prepQueue: [...prev.prepQueue, updatedItem],
      };
    });
  }, []);

  // Deliver carried item to a table
  const deliverToTable = useCallback((tableId: number) => {
    setState((prev) => {
      if (!prev.playerHandItem) return prev;

      const handItem = prev.playerHandItem;
      const table = prev.tables.find((t) => t.id === tableId);
      if (!table || !table.order) return { ...prev, playerHandItem: null };

      const order = prev.activeOrders.find((o) => o.tableId === tableId);
      if (!order) return { ...prev, playerHandItem: null };

      // Find matching item in order that is ready
      const matchingIdx = order.items.findIndex(
        (it) =>
          it.menuItem.id === handItem.menuItem.id && it.status === "ready"
      );

      if (matchingIdx === -1) {
        // Wrong item — no penalty, just drop
        return { ...prev, playerHandItem: null };
      }

      const updatedOrders = prev.activeOrders.map((o) => {
        if (o.id !== order.id) return o;
        const updatedItems = o.items.map((it, idx) => {
          if (idx !== matchingIdx) return it;
          return { ...it, status: "delivered" as OrderStatus };
        });
        return { ...o, items: updatedItems };
      });

      const updatedOrder = updatedOrders.find((o) => o.id === order.id)!;
      const allDelivered = updatedOrder.items.every((it) => it.status === "delivered");

      let updatedTables = prev.tables;
      let newActiveOrders = updatedOrders;
      let scoreGain = pointsPerDelivery;
      let completedOrders = prev.completedOrders;

      if (allDelivered) {
        // Order complete — table is now "done" (eating)
        updatedTables = prev.tables.map((t) =>
          t.id === tableId
            ? { ...t, status: "done" as const }
            : t
        );
        completedOrders++;
        scoreGain += pointsPerDelivery; // bonus for completing full order

        // After a delay, clear the table (handled separately)
        setTimeout(() => {
          setState((s) => ({
            ...s,
            tables: s.tables.map((t) =>
              t.id === tableId && t.status === "done"
                ? { ...t, status: "empty" as const, order: undefined, customerEmoji: undefined }
                : t
            ),
            activeOrders: s.activeOrders.filter((o) => o.id !== order.id),
          }));
        }, 2000);
      } else {
        updatedTables = prev.tables.map((t) =>
          t.id === tableId
            ? { ...t, order: updatedOrder }
            : t
        );
      }

      return {
        ...prev,
        activeOrders: newActiveOrders,
        tables: updatedTables,
        playerHandItem: null,
        score: prev.score + scoreGain,
        completedOrders,
      };
    });
  }, [pointsPerDelivery]);

  // Pick up a ready item from the prep queue
  const pickUpItem = useCallback((orderId: string, itemId: string) => {
    setState((prev) => {
      const readyItem = prev.prepQueue.find(
        (it) => it.menuItem.id === itemId && it.status === "ready"
      );
      if (!readyItem) return prev;

      return {
        ...prev,
        prepQueue: prev.prepQueue.filter(
          (it) => !(it.menuItem.id === itemId && it.status === "ready")
        ),
        playerHandItem: readyItem,
      };
    });
  }, []);

  const dropItem = useCallback(() => {
    setState((prev) => ({ ...prev, playerHandItem: null }));
  }, []);

  // Game loop — countdown timer
  useEffect(() => {
    if (state.phase !== "playing") return;

    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.phase !== "playing") return prev;
        const newTime = prev.timeLeft - 1;
        if (newTime <= 0) {
          return { ...prev, timeLeft: 0, phase: "level_complete" };
        }
        return { ...prev, timeLeft: newTime };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.phase]);

  // Prep timer — advance items from preparing → ready
  useEffect(() => {
    if (state.phase !== "playing") return;

    prepTimerRef.current = setInterval(() => {
      const now = Date.now();
      setState((prev) => {
        if (prev.phase !== "playing") return prev;

        let changed = false;
        const updatedQueue = prev.prepQueue.map((item) => {
          if (item.status === "preparing" && item.prepStartedAt) {
            const elapsed = (now - item.prepStartedAt) / 1000;
            if (elapsed >= item.menuItem.prepTimeSeconds) {
              changed = true;
              return { ...item, status: "ready" as OrderStatus };
            }
          }
          return item;
        });

        if (!changed) return prev;

        // Also update order items to "ready"
        const readyIds = new Set(
          updatedQueue
            .filter((it) => it.status === "ready")
            .map((it) => it.menuItem.id)
        );

        const updatedOrders = prev.activeOrders.map((order) => ({
          ...order,
          items: order.items.map((it) => {
            if (it.status === "preparing" && readyIds.has(it.menuItem.id)) {
              return { ...it, status: "ready" as OrderStatus };
            }
            return it;
          }),
        }));

        return { ...prev, prepQueue: updatedQueue, activeOrders: updatedOrders };
      });
    }, 500);

    return () => {
      if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    };
  }, [state.phase]);

  // Customer patience / mood timer — ticks 4x per second so the on-screen
  // progress bar drains smoothly instead of stepping by whole seconds.
  useEffect(() => {
    if (state.phase !== "playing") return;

    const TICK_MS = 250;
    const TICK_SECONDS = TICK_MS / 1000;

    moodTimerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.phase !== "playing") return prev;

        let missedCount = 0;
        const leavingIds = new Set<string>();

        const updatedOrders = prev.activeOrders
          .map((order) => {
            const nextRemaining = Math.max(0, order.patienceRemaining - TICK_SECONDS);
            const ratio = 1 - nextRemaining / order.patience;
            let mood: CustomerOrder["mood"] = "happy";
            if (ratio > 0.8) mood = "angry";
            else if (ratio > 0.6) mood = "impatient";
            else if (ratio > 0.4) mood = "neutral";

            // Customer leaves when patience drains to zero — player loses
            // points for the missed order.
            if (nextRemaining <= 0) {
              missedCount++;
              leavingIds.add(order.id);
              return null;
            }

            return { ...order, mood, patienceRemaining: nextRemaining };
          })
          .filter(Boolean) as typeof prev.activeOrders;

        const updatedTables = prev.tables.map((t) => {
          if (t.order && leavingIds.has(t.order.id)) {
            return { ...t, status: "empty" as const, order: undefined, customerEmoji: undefined };
          }
          return t;
        });

        // Penalty for letting customers walk out.
        const penalty = missedCount * pointsPerDelivery;

        return {
          ...prev,
          activeOrders: updatedOrders,
          tables: updatedTables,
          missedOrders: prev.missedOrders + missedCount,
          score: Math.max(0, prev.score - penalty),
        };
      });
    }, TICK_MS);

    return () => {
      if (moodTimerRef.current) clearInterval(moodTimerRef.current);
    };
  }, [state.phase, pointsPerDelivery]);

  // Customer spawn timer — interval driven by the active level config.
  useEffect(() => {
    if (state.phase !== "playing") return;

    const spawnIntervalMs = Math.max(
      1000,
      levelConfig.arrivalIntervalSeconds * 1000
    );

    spawnCustomer(); // immediate first spawn

    customerSpawnRef.current = setInterval(() => {
      if (totalCustomersSpawnedRef.current < maxCustomers) {
        spawnCustomer();
      } else {
        if (customerSpawnRef.current) {
          clearInterval(customerSpawnRef.current);
        }
      }
    }, spawnIntervalMs);

    return () => {
      if (customerSpawnRef.current) clearInterval(customerSpawnRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, levelConfig]);

  return {
    state,
    levelConfig,
    startGame,
    pauseGame,
    resumeGame,
    goHome,
    prepareItem,
    deliverToTable,
    pickUpItem,
    dropItem,
  };
}
