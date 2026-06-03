/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TGameColors = {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
};

export type TGameSettings = {
  levelDurationSeconds: number;
  maxCustomers: number;
  numTables: number;
  pointsPerDelivery: number;
  enableSoundEffects: boolean;
};

export type TMenuItem = {
  id: string;
  name: string;
  emoji: string;
  category: "drink" | "food" | "dessert";
  prepTimeSeconds: number;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  tagline?: string;
  brandColor: TBrandColor;
  gameColors?: TGameColors;
  gameSettings?: TGameSettings;
  menuItems?: TMenuItem[];
  welcomeTitle?: string;
  welcomeSubtitle?: string;
  playButtonLabel?: string;
  heroImageUrl?: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Cafe Dash",
  logoUrl: "FILL_LOGO_URL_HERE",
  tagline: "Rush. Serve. Repeat.",
  brandColor: {
    primary: "#FF7043",
    secondary: "#FFC107",
    accent: "#26C6DA",
  },
  gameColors: {
    background: "#FFF8F0",
    surface: "#FFE0CC",
    textPrimary: "#3E2723",
    textSecondary: "#6D4C41",
    success: "#66BB6A",
    warning: "#FFA726",
    error: "#EF5350",
  },
  gameSettings: {
    levelDurationSeconds: 90,
    maxCustomers: 12,
    numTables: 4,
    pointsPerDelivery: 100,
    enableSoundEffects: true,
  },
  menuItems: [
    { id: "coffee", name: "Coffee", emoji: "☕", category: "drink", prepTimeSeconds: 3 },
    { id: "tea", name: "Tea", emoji: "🍵", category: "drink", prepTimeSeconds: 2 },
    { id: "juice", name: "Orange Juice", emoji: "🥤", category: "drink", prepTimeSeconds: 2 },
    { id: "latte", name: "Latte", emoji: "🧋", category: "drink", prepTimeSeconds: 4 },
    { id: "sandwich", name: "Sandwich", emoji: "🥪", category: "food", prepTimeSeconds: 5 },
    { id: "burger", name: "Burger", emoji: "🍔", category: "food", prepTimeSeconds: 6 },
    { id: "salad", name: "Salad", emoji: "🥗", category: "food", prepTimeSeconds: 4 },
    { id: "pasta", name: "Pasta", emoji: "🍝", category: "food", prepTimeSeconds: 7 },
    { id: "cake", name: "Cake Slice", emoji: "🍰", category: "dessert", prepTimeSeconds: 2 },
    { id: "icecream", name: "Ice Cream", emoji: "🍦", category: "dessert", prepTimeSeconds: 2 },
    { id: "muffin", name: "Muffin", emoji: "🧁", category: "dessert", prepTimeSeconds: 3 },
    { id: "waffle", name: "Waffle", emoji: "🧇", category: "dessert", prepTimeSeconds: 4 },
  ],
  welcomeTitle: "Welcome to Cafe Dash!",
  welcomeSubtitle: "Take orders, prep food, and deliver before time runs out. Can you handle the rush?",
  playButtonLabel: "Start Playing",
  heroImageUrl: "",
};
