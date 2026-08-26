export type PlateRole =
  | 'STAPLE'
  | 'PROTEIN'
  | 'VEGETABLE'
  | 'LEGUME'
  | 'SALAD'
  | 'FRUIT'
  | 'BEVERAGE'
  | 'OTHER';

export type FoodCategory =
  | 'staple'
  | 'protein'
  | 'vegetable'
  | 'legume'
  | 'salad'
  | 'fruit'
  | 'beverage'
  | 'pantry';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'any';

export interface PlateComponent {
  role: PlateRole;
  name: string;
  foodItemId?: string;
  isOptional?: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  inStock: boolean;
  isStaple?: boolean;
  tags?: string[];
  unit?: string;
  parentId?: string; // Links to a parent food group (e.g. fp-ugali) for variant display
}

export interface Meal {
  id: string;
  name: string;
  description?: string;
  plate: PlateComponent[];
  mealType?: MealType;
  tags?: string[];
  isQuick?: boolean; // Keep it easy / quick meal
  isFavorite?: boolean;
  isExcluded?: boolean; // "Never" blacklist
  image?: string;
  lastCooked?: string; // ISO date string
  cookingTimeMinutes?: number;
}

export interface DailyPlanSlot {
  mealType: 'breakfast' | 'lunch' | 'dinner';
  meal: Meal;
  isLeftover?: boolean;
  isLocked?: boolean;
  notes?: string;
}

export interface DailyPlan {
  date: string; // YYYY-MM-DD
  breakfast: DailyPlanSlot;
  lunch: DailyPlanSlot;
  dinner: DailyPlanSlot;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: FoodCategory;
  isChecked: boolean;
  isCustom?: boolean;
  sourceMealCount?: number;
}

export interface HistoryEntry {
  id: string;
  mealId: string;
  mealName: string;
  plateSummary: string;
  cookedAt: string; // ISO timestamp
  rating?: number;
  hadLeftovers?: boolean;
}

export interface UserSettings {
  allowLeftoversForBreakfast: boolean;
  keepItEasyDefault: boolean;
  householdSize: number;
  spicinessPreference: 'mild' | 'medium' | 'high';
  theme: 'editorial-ivory';
}

export interface DecisionResult {
  meal: Meal;
  score: number;
  isFallback: boolean;
  fallbackReason?: string;
  matchedIngredientsCount: number;
  totalIngredientsCount: number;
  balanceScore: number;
  recencyPenalty: number;
}
