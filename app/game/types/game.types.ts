export type ItemCategory = "drink" | "food" | "dessert";

export interface MenuItem {
  id: string;
  name: string;
  emoji: string;
  category: ItemCategory;
  prepTimeSeconds: number;
}

export type CustomerMood = "happy" | "neutral" | "impatient" | "angry";

export type OrderStatus = "pending" | "preparing" | "ready" | "delivered";

export interface OrderItem {
  menuItem: MenuItem;
  status: OrderStatus;
  prepStartedAt?: number; // timestamp
}

export interface CustomerOrder {
  id: string;
  tableId: number;
  customerId: string;
  items: OrderItem[];
  arrivedAt: number; // timestamp
  patience: number; // total seconds of patience this customer started with
  patienceRemaining: number; // seconds left before customer leaves (drains over time)
  mood: CustomerMood;
}

export type TableStatus = "empty" | "occupied" | "waiting_delivery" | "eating" | "done";

export interface Table {
  id: number;
  status: TableStatus;
  order?: CustomerOrder;
  customerEmoji?: string;
}

export type GamePhase = "home" | "playing" | "paused" | "level_complete" | "game_over";

export interface PrepStation {
  id: string;
  category: ItemCategory;
  label: string;
  emoji: string;
  items: MenuItem[];
}

export interface GameState {
  phase: GamePhase;
  level: number;
  score: number;
  timeLeft: number; // seconds
  tables: Table[];
  activeOrders: CustomerOrder[];
  prepQueue: OrderItem[]; // items currently being prepared
  completedOrders: number;
  missedOrders: number;
  selectedTableId: number | null;
  playerHandItem: OrderItem | null; // item player is carrying to deliver
}
