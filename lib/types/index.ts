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

export type DataSource = 'default' | 'personal';

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
  parentId?: string;
  source: DataSource;
}

export interface Meal {
  id: string;
  name: string;
  description?: string;
  plate: PlateComponent[];
  mealType?: MealType;
  tags?: string[];
  isQuick?: boolean;
  isFavorite?: boolean;
  isExcluded?: boolean;
  lastCooked?: string;
  cookingTimeMinutes?: number;
  source: DataSource;
}

export interface DailyPlanSlot {
  mealType: 'breakfast' | 'lunch' | 'dinner';
  meal: Meal;
  isLeftover?: boolean;
  isLocked?: boolean;
  notes?: string;
}

export interface DailyPlan {
  date: string;
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
  cookedAt: string;
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
