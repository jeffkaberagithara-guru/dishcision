import { Meal, MealType } from '@/lib/types';

export interface DecisionCriteria {
  mealType?: MealType;
  mustUseInStockOnly?: boolean;
  keepItEasy?: boolean; // filter/boost quick meals
  excludedMealIds?: string[]; // "Not Today" temporary skips
  neverMealIds?: string[]; // "Never" permanent blacklist
  targetDate?: Date;
  customAvailableFoodIds?: string[]; // Selected in "Use What I Have" modal
}

export interface ScoredMealCandidate {
  meal: Meal;
  score: number;
  availabilityRatio: number;
  missingItemNames: string[];
  balanceScore: number;
  recencyPenalty: number;
  isQuickBonus: number;
}
