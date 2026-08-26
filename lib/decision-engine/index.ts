import { FoodItem, Meal, DecisionResult } from '@/lib/types';
import { DecisionCriteria } from './types';
import { rankMealCandidates } from './scoring';
import { generateFallbackMeal } from './fallbacks';

export * from './types';
export * from './scoring';
export * from './fallbacks';
export * from './leftovers';
export * from './day-planner';
export * from './shopping';

export function makeDishcision(
  allMeals: Meal[],
  foodItems: FoodItem[],
  criteria: DecisionCriteria = {}
): DecisionResult {
  const ranked = rankMealCandidates(allMeals, foodItems, criteria);

  if (ranked.length > 0) {
    const best = ranked[0];
    const totalPlate = best.meal.plate.length || 1;
    const matchedCount = Math.round(best.availabilityRatio * totalPlate);

    return {
      meal: best.meal,
      score: best.score,
      isFallback: false,
      matchedIngredientsCount: matchedCount,
      totalIngredientsCount: totalPlate,
      balanceScore: best.balanceScore,
      recencyPenalty: best.recencyPenalty,
    };
  }

  // If no candidates matched constraints, generate fallback
  const inStock = criteria.customAvailableFoodIds
    ? foodItems.filter((f) => criteria.customAvailableFoodIds!.includes(f.id))
    : foodItems.filter((f) => f.inStock);

  const fallback = generateFallbackMeal(inStock, criteria);

  return {
    meal: fallback.meal,
    score: 50,
    isFallback: true,
    fallbackReason: fallback.reason,
    matchedIngredientsCount: fallback.meal.plate.length,
    totalIngredientsCount: fallback.meal.plate.length,
    balanceScore: 15,
    recencyPenalty: 0,
  };
}
