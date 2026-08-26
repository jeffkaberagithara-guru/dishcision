import { FoodItem, Meal } from '@/lib/types';
import { DecisionCriteria, ScoredMealCandidate } from './types';
import { FOOD_VARIANTS, isFoodAppropriateForMeal } from '@/lib/data/food-taxonomy';

export function calculateRecencyPenalty(lastCookedStr?: string, targetDate: Date = new Date()): number {
  if (!lastCookedStr) return 0;
  const lastCooked = new Date(lastCookedStr);
  const diffTime = targetDate.getTime() - lastCooked.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 40; // Cooked today
  if (diffDays === 1) return 30; // Cooked yesterday
  if (diffDays === 2) return 20;
  if (diffDays === 3) return 10;
  if (diffDays <= 7) return 5;
  return 0;
}

export function calculateBalanceScore(meal: Meal): number {
  const roles = new Set(meal.plate.map((p) => p.role));
  const hasStaple = roles.has('STAPLE');
  const hasProteinOrLegume = roles.has('PROTEIN') || roles.has('LEGUME');
  const hasVegOrSalad = roles.has('VEGETABLE') || roles.has('SALAD');

  if (hasStaple && hasProteinOrLegume && hasVegOrSalad) {
    return 25; // Complete balanced plate
  }
  if ((hasStaple && hasProteinOrLegume) || (hasStaple && hasVegOrSalad) || (hasProteinOrLegume && hasVegOrSalad)) {
    return 15; // 2 out of 3 components
  }
  return 5;
}

export function scoreMealCandidate(
  meal: Meal,
  foodItems: FoodItem[],
  criteria: DecisionCriteria = {}
): ScoredMealCandidate | null {
  // 1. Exclusions
  if (meal.isExcluded) return null;
  if (criteria.neverMealIds?.includes(meal.id)) return null;
  if (criteria.excludedMealIds?.includes(meal.id)) return null;

  const targetDate = criteria.targetDate || new Date();
  const activeStockMap = new Map<string, boolean>();

  if (criteria.customAvailableFoodIds && criteria.customAvailableFoodIds.length > 0) {
    criteria.customAvailableFoodIds.forEach((id) => activeStockMap.set(id, true));
  } else {
    foodItems.forEach((item) => activeStockMap.set(item.id, item.inStock));
  }

  // 2. Availability checking
  let matchedCount = 0;
  const missingItemNames: string[] = [];

  meal.plate.forEach((comp) => {
    let isInStock = false;
    if (comp.foodItemId) {
      isInStock = !!activeStockMap.get(comp.foodItemId);
    } else {
      // Find by matching item name in food items
      const matched = foodItems.find(
        (f) => f.name.toLowerCase().includes(comp.name.toLowerCase()) || comp.name.toLowerCase().includes(f.name.toLowerCase())
      );
      isInStock = matched ? (criteria.customAvailableFoodIds ? criteria.customAvailableFoodIds.includes(matched.id) : matched.inStock) : true;
    }

    if (isInStock || comp.isOptional) {
      matchedCount++;
    } else {
      missingItemNames.push(comp.name);
    }
  });

  const totalPlate = meal.plate.length || 1;
  const availabilityRatio = matchedCount / totalPlate;

  if (criteria.mustUseInStockOnly && availabilityRatio < 1) {
    return null;
  }

  // Base score: 100 max
  const availabilityScore = availabilityRatio * 50;
  const balanceScore = calculateBalanceScore(meal);
  const recencyPenalty = calculateRecencyPenalty(meal.lastCooked, targetDate);

  let typeAffinity = 0;
  if (criteria.mealType && criteria.mealType !== 'any') {
    if (meal.mealType === criteria.mealType || meal.mealType === 'any' || !meal.mealType) {
      typeAffinity = 15;
    } else {
      typeAffinity = -30; // Strong penalty for wrong meal type (e.g. breakfast for dinner)
    }

    // Taxonomy-based food appropriateness: bonus if all plate foods are appropriate for target meal
    const plateFoodAppropriateness = meal.plate.reduce((acc, comp) => {
      if (!comp.foodItemId) return acc;
      const variant = FOOD_VARIANTS.find((v) => v.id === comp.foodItemId);
      if (variant && isFoodAppropriateForMeal(variant.mealTypes, criteria.mealType!)) {
        return acc + 1;
      }
      return acc;
    }, 0);
    const totalWithFoodIds = meal.plate.filter((p) => p.foodItemId).length || 1;
    const appropriatenessRatio = plateFoodAppropriateness / totalWithFoodIds;
    typeAffinity += Math.round(appropriatenessRatio * 10); // up to +10 bonus
  }

  let isQuickBonus = 0;
  if (criteria.keepItEasy && meal.isQuick) {
    isQuickBonus = 15;
  }

  const favoriteBonus = meal.isFavorite ? 5 : 0;

  const totalScore = availabilityScore + balanceScore + typeAffinity + isQuickBonus + favoriteBonus - recencyPenalty;

  return {
    meal,
    score: totalScore,
    availabilityRatio,
    missingItemNames,
    balanceScore,
    recencyPenalty,
    isQuickBonus,
  };
}

export function rankMealCandidates(
  meals: Meal[],
  foodItems: FoodItem[],
  criteria: DecisionCriteria = {}
): ScoredMealCandidate[] {
  const candidates: ScoredMealCandidate[] = [];

  for (const meal of meals) {
    const scored = scoreMealCandidate(meal, foodItems, criteria);
    if (scored !== null) {
      candidates.push(scored);
    }
  }

  // Sort descending by score
  candidates.sort((a, b) => b.score - a.score);
  return candidates;
}
