import { FoodItem, Meal } from '@/lib/types';
import { DecisionCriteria, ScoredMealCandidate } from './types';
import { FOOD_VARIANTS, isFoodAppropriateForMeal, getFoodMealTypes, isFoodAllowedForTargetMeal } from '@/lib/data/food-taxonomy';

export function calculateRecencyPenalty(lastCookedStr?: string, targetDate: Date = new Date()): number {
  if (!lastCookedStr) return 0;
  const lastCooked = new Date(lastCookedStr);
  const diffTime = targetDate.getTime() - lastCooked.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 50;  // Cooked today — strong avoid
  if (diffDays === 1) return 35; // Yesterday — still heavy
  if (diffDays === 2) return 20;
  if (diffDays === 3) return 10;
  if (diffDays <= 5) return 5;
  return 0;
}

/**
 * Balance score: rewards meals with diverse plate roles.
 * A balanced plate has: STAPLE + PROTEIN/LEGUME + VEGETABLE/SALAD
 * Max 30 points for a fully balanced plate.
 */
export function calculateBalanceScore(meal: Meal): number {
  const roles = new Set(meal.plate.map((p) => p.role));
  const hasStaple = roles.has('STAPLE');
  const hasProtein = roles.has('PROTEIN');
  const hasLegume = roles.has('LEGUME');
  const hasVegetable = roles.has('VEGETABLE');
  const hasSalad = roles.has('SALAD');
  const hasFruit = roles.has('FRUIT');
  const hasBeverage = roles.has('BEVERAGE');

  let score = 0;

  // Core balanced plate: STAPLE + (PROTEIN or LEGUME) + (VEGETABLE or SALAD)
  if (hasStaple) score += 8;
  if (hasProtein || hasLegume) score += 8;
  if (hasVegetable || hasSalad) score += 8;

  // Bonus for completeness
  if (hasStaple && (hasProtein || hasLegume) && (hasVegetable || hasSalad)) {
    score += 6; // Full balanced plate bonus
  }

  // Micro-nutrition bonuses
  if (hasFruit) score += 3;
  if (hasBeverage && meal.mealType === 'breakfast') score += 2;

  return Math.min(score, 30);
}

/**
 * Cross-meal diversity score for day planning.
 * Penalizes using the same protein or staple across meals.
 */
export function calculateCrossMealPenalty(
  meal: Meal,
  usedProteins: Set<string>,
  usedStaples: Set<string>,
): number {
  let penalty = 0;

  for (const comp of meal.plate) {
    const nameLower = comp.name.toLowerCase();

    if ((comp.role === 'PROTEIN' || comp.role === 'LEGUME') && usedProteins.has(nameLower)) {
      penalty += 25;
    }
    if (comp.role === 'STAPLE' && usedStaples.has(nameLower)) {
      penalty += 15;
    }
    if (comp.role === 'PROTEIN' || comp.role === 'LEGUME') {
      usedProteins.add(nameLower);
    }
    if (comp.role === 'STAPLE') {
      usedStaples.add(nameLower);
    }
  }

  return penalty;
}

export function scoreMealCandidate(
  meal: Meal,
  foodItems: FoodItem[],
  criteria: DecisionCriteria = {}
): ScoredMealCandidate | null {
  if (meal.isExcluded) return null;
  if (criteria.neverMealIds?.includes(meal.id)) return null;
  if (criteria.excludedMealIds?.includes(meal.id)) return null;

  // Strict meal separation: never serve a meal whose plate contains a food
  // that is off-limits for the requested meal type (e.g. breakfast-only items
  // must not appear in lunch or dinner).
  if (criteria.mealType && criteria.mealType !== 'any') {
    const hasInappropriateFood = meal.plate.some((comp) => {
      if (!comp.foodItemId) return false;
      const food = foodItems.find((f) => f.id === comp.foodItemId);
      if (!food) return false;
      return !isFoodAllowedForTargetMeal(getFoodMealTypes(food), criteria.mealType!);
    });
    if (hasInappropriateFood) return null;
  }

  const activeStockMap = new Map<string, boolean>();

  if (criteria.customAvailableFoodIds && criteria.customAvailableFoodIds.length > 0) {
    criteria.customAvailableFoodIds.forEach((id) => activeStockMap.set(id, true));
  } else {
    foodItems.forEach((item) => activeStockMap.set(item.id, item.inStock));
  }

  let matchedCount = 0;
  const missingItemNames: string[] = [];

  meal.plate.forEach((comp) => {
    let isInStock = false;
    if (comp.foodItemId) {
      isInStock = !!activeStockMap.get(comp.foodItemId);
    } else {
      const matched = foodItems.find(
        (f) => f.name.toLowerCase().includes(comp.name.toLowerCase()) ||
               comp.name.toLowerCase().includes(f.name.toLowerCase())
      );
      isInStock = matched
        ? (criteria.customAvailableFoodIds
            ? criteria.customAvailableFoodIds.includes(matched.id)
            : matched.inStock)
        : true;
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

  // === SCORING (max ~100) ===

  // 1. Availability (0-50): are ingredients available?
  const availabilityScore = availabilityRatio * 50;

  // 2. Nutritional balance (0-30): diverse plate roles
  const balanceScore = calculateBalanceScore(meal);

  // 3. Meal type affinity (0-20, or -30 penalty)
  let typeAffinity = 0;
  if (criteria.mealType && criteria.mealType !== 'any') {
    if (meal.mealType === criteria.mealType || meal.mealType === 'any' || !meal.mealType) {
      typeAffinity = 15;
    } else {
      typeAffinity = -30;
    }

    // Taxonomy food appropriateness bonus
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
    typeAffinity += Math.round(appropriatenessRatio * 10);
  }

  // 4. Quick meal bonus (0-15)
  const isQuickBonus = (criteria.keepItEasy && meal.isQuick) ? 15 : 0;

  // 5. Favorite bonus (0-5)
  const favoriteBonus = meal.isFavorite ? 5 : 0;

  // 6. Recency penalty (-50 to 0)
  const recencyPenalty = calculateRecencyPenalty(meal.lastCooked);

  // 7. Cross-meal variety penalty (if provided)
  const crossMealPenalty = criteria.usedProteins || criteria.usedStaples
    ? calculateCrossMealPenalty(
        meal,
        criteria.usedProteins || new Set(),
        criteria.usedStaples || new Set(),
      )
    : 0;

  const totalScore = availabilityScore + balanceScore + typeAffinity + isQuickBonus + favoriteBonus - recencyPenalty - crossMealPenalty;

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

  candidates.sort((a, b) => {
    const diff = b.score - a.score;
    if (diff !== 0) return diff;
    // Shuffle same-scored candidates for variety
    return Math.random() - 0.5;
  });
  return candidates;
}
