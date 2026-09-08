import { FoodItem, Meal, DecisionResult } from '@/lib/types';
import { DecisionCriteria } from './types';
import { rankMealCandidates } from './scoring';
import { generateFallbackMeal, generateDynamicMeals } from './fallbacks';
import { getFoodMealTypes, isFoodAllowedForTargetMeal } from '@/lib/data/food-taxonomy';

export * from './types';
export * from './scoring';
export * from './fallbacks';
export * from './leftovers';
export * from './day-planner';
export * from './shopping';

/**
 * Get the pool of available food items based on criteria.
 * When a specific meal type is requested, items that are off-limits for that
 * meal (e.g. breakfast-only foods for lunch/dinner) are filtered out so
 * dynamic combos and fallbacks never mix them.
 */
function getAvailableFoods(foodItems: FoodItem[], criteria: DecisionCriteria): FoodItem[] {
  let pool: FoodItem[];
  if (criteria.customAvailableFoodIds && criteria.customAvailableFoodIds.length > 0) {
    const idSet = new Set(criteria.customAvailableFoodIds);
    pool = foodItems.filter((f) => idSet.has(f.id));
  } else {
    pool = foodItems.filter((f) => f.inStock);
  }

  if (criteria.mealType && criteria.mealType !== 'any') {
    const target = criteria.mealType;
    pool = pool.filter((f) => isFoodAllowedForTargetMeal(getFoodMealTypes(f), target));
  }

  return pool;
}

export function makeDishcision(
  allMeals: Meal[],
  foodItems: FoodItem[],
  criteria: DecisionCriteria = {}
): DecisionResult {
  const availableFoods = getAvailableFoods(foodItems, criteria);

  // 1. Rank pre-defined meals (user's saved meals + starter meals)
  const ranked = rankMealCandidates(allMeals, foodItems, criteria);

  // 2. Also generate dynamic combos from available foods
  const excludedNames = new Set(
    ranked.map((r) => r.meal.plate.map((p) => p.name).sort().join('|'))
  );
  const dynamicMeals = generateDynamicMeals(
    availableFoods,
    10,
    criteria.mealType,
    excludedNames,
  );

  // 3. Score the dynamic combos too
  const dynamicRanked = rankMealCandidates(dynamicMeals, foodItems, criteria);

  // 4. Merge: pre-defined meals first (they're more "authentic"), then dynamic
  const allCandidates = [...ranked, ...dynamicRanked];

  if (allCandidates.length > 0) {
    const best = allCandidates[0];
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

  // 5. Absolute fallback: generate one combo
  const fallback = generateFallbackMeal(availableFoods, criteria);

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
