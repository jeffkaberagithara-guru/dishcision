import { Meal, MealType } from '@/lib/types';

export interface DecisionCriteria {
  mealType?: MealType;
  mustUseInStockOnly?: boolean;
  keepItEasy?: boolean;
  excludedMealIds?: string[];
  neverMealIds?: string[];
  targetDate?: Date;
  customAvailableFoodIds?: string[];
  usedProteins?: Set<string>;
  usedStaples?: Set<string>;
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
