import { DailyPlan, DailyPlanSlot, FoodItem, HistoryEntry, Meal, UserSettings } from '@/lib/types';
import { rankMealCandidates } from './scoring';
import { generateFallbackMeal, generateDynamicMeals } from './fallbacks';
import { generateLeftoverBreakfast } from './leftovers';

function getMealProteins(meal: Meal): string[] {
  return meal.plate
    .filter((p) => p.role === 'PROTEIN' || p.role === 'LEGUME')
    .map((p) => p.name.toLowerCase());
}

function getMealStaples(meal: Meal): string[] {
  return meal.plate
    .filter((p) => p.role === 'STAPLE')
    .map((p) => p.name.toLowerCase());
}

/**
 * Get all available (in-stock) food items.
 */
function getAvailableFoods(foodItems: FoodItem[]): FoodItem[] {
  return foodItems.filter((f) => f.inStock);
}

/**
 * Pick the best meal from pre-defined + dynamic combos.
 * Always returns a balanced meal if any food is available.
 */
function pickBestMeal(
  allMeals: Meal[],
  foodItems: FoodItem[],
  criteria: {
    mealType?: string;
    targetDate?: Date;
    excludedMealIds?: string[];
    usedProteins?: Set<string>;
    usedStaples?: Set<string>;
  },
): Meal {
  const available = getAvailableFoods(foodItems);

  // Rank pre-defined meals
  const ranked = rankMealCandidates(allMeals, foodItems, {
    mealType: criteria.mealType as 'breakfast' | 'lunch' | 'dinner' | 'any' | undefined,
    targetDate: criteria.targetDate,
    excludedMealIds: criteria.excludedMealIds,
    usedProteins: criteria.usedProteins,
    usedStaples: criteria.usedStaples,
  });

  // Generate dynamic combos from available foods
  const excludedNames = new Set(
    ranked.map((r) => r.meal.plate.map((p) => p.name).sort().join('|'))
  );
  const dynamicMeals = generateDynamicMeals(
    available,
    15,
    criteria.mealType,
    excludedNames,
  );

  // Score dynamic combos
  const dynamicRanked = rankMealCandidates(dynamicMeals, foodItems, {
    mealType: criteria.mealType as 'breakfast' | 'lunch' | 'dinner' | 'any' | undefined,
    targetDate: criteria.targetDate,
    excludedMealIds: criteria.excludedMealIds,
    usedProteins: criteria.usedProteins,
    usedStaples: criteria.usedStaples,
  });

  // Merge: pre-defined first, then dynamic
  const allCandidates = [...ranked, ...dynamicRanked];

  if (allCandidates.length > 0) {
    return allCandidates[0].meal;
  }

  // Absolute fallback
  const fallback = generateFallbackMeal(available, { mealType: criteria.mealType as 'breakfast' | 'lunch' | 'dinner' | 'any' | undefined });
  return fallback.meal;
}

export function generateDailyPlan(
  allMeals: Meal[],
  foodItems: FoodItem[],
  recentHistory: HistoryEntry[],
  settings: UserSettings,
  targetDate: Date = new Date(),
  currentPlan?: DailyPlan | null
): DailyPlan {
  const dateStr = targetDate.toISOString().split('T')[0];
  const usedMealIds = new Set<string>();
  const usedProteins = new Set<string>();
  const usedStaples = new Set<string>();

  function recordMeal(meal: Meal) {
    usedMealIds.add(meal.id);
    getMealProteins(meal).forEach((p) => usedProteins.add(p));
    getMealStaples(meal).forEach((s) => usedStaples.add(s));
  }

  // 1. BREAKFAST
  let breakfastSlot: DailyPlanSlot;

  if (currentPlan?.breakfast?.isLocked && currentPlan.breakfast.meal) {
    breakfastSlot = currentPlan.breakfast;
    recordMeal(breakfastSlot.meal);
  } else {
    const leftover = generateLeftoverBreakfast(recentHistory, allMeals, settings);
    if (leftover) {
      breakfastSlot = {
        mealType: 'breakfast',
        meal: leftover.meal,
        isLeftover: true,
        isLocked: false,
      };
      recordMeal(leftover.meal);
    } else {
      const chosen = pickBestMeal(allMeals, foodItems, {
        mealType: 'breakfast',
        targetDate,
        excludedMealIds: Array.from(usedMealIds),
        usedProteins: new Set(usedProteins),
        usedStaples: new Set(usedStaples),
      });
      breakfastSlot = {
        mealType: 'breakfast',
        meal: chosen,
        isLeftover: false,
        isLocked: false,
      };
      recordMeal(chosen);
    }
  }

  // 2. DINNER
  let dinnerSlot: DailyPlanSlot;

  if (currentPlan?.dinner?.isLocked && currentPlan.dinner.meal) {
    dinnerSlot = currentPlan.dinner;
    recordMeal(dinnerSlot.meal);
  } else {
    const chosen = pickBestMeal(allMeals, foodItems, {
      mealType: 'dinner',
      targetDate,
      excludedMealIds: Array.from(usedMealIds),
      usedProteins: new Set(usedProteins),
      usedStaples: new Set(usedStaples),
    });
    dinnerSlot = {
      mealType: 'dinner',
      meal: chosen,
      isLeftover: false,
      isLocked: false,
    };
    recordMeal(chosen);
  }

  // 3. LUNCH
  let lunchSlot: DailyPlanSlot;

  if (currentPlan?.lunch?.isLocked && currentPlan.lunch.meal) {
    lunchSlot = currentPlan.lunch;
  } else {
    const chosen = pickBestMeal(allMeals, foodItems, {
      mealType: 'lunch',
      targetDate,
      excludedMealIds: Array.from(usedMealIds),
      usedProteins: new Set(usedProteins),
      usedStaples: new Set(usedStaples),
    });
    lunchSlot = {
      mealType: 'lunch',
      meal: chosen,
      isLeftover: false,
      isLocked: false,
    };
  }

  return {
    date: dateStr,
    breakfast: breakfastSlot,
    lunch: lunchSlot,
    dinner: dinnerSlot,
  };
}

export function regeneratePlanSlot(
  slotType: 'breakfast' | 'lunch' | 'dinner',
  currentPlan: DailyPlan,
  allMeals: Meal[],
  foodItems: FoodItem[]
): DailyPlan {
  const otherSlots = (['breakfast', 'lunch', 'dinner'] as const).filter((s) => s !== slotType);

  const usedProteins = new Set<string>();
  const usedStaples = new Set<string>();

  otherSlots.forEach((s) => {
    const meal = currentPlan[s]?.meal;
    if (meal) {
      getMealProteins(meal).forEach((p) => usedProteins.add(p));
      getMealStaples(meal).forEach((s2) => usedStaples.add(s2));
    }
  });

  const currentMealId = currentPlan[slotType].meal.id;
  const exclusions = [
    ...otherSlots.map((s) => currentPlan[s]?.meal?.id).filter(Boolean),
    currentMealId,
  ];

  const newMeal = pickBestMeal(allMeals, foodItems, {
    mealType: slotType,
    excludedMealIds: exclusions,
    usedProteins,
    usedStaples,
  });

  return {
    ...currentPlan,
    [slotType]: {
      mealType: slotType,
      meal: newMeal,
      isLeftover: false,
      isLocked: false,
    },
  };
}
