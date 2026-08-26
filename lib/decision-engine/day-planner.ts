import { DailyPlan, DailyPlanSlot, FoodItem, HistoryEntry, Meal, UserSettings } from '@/lib/types';
import { rankMealCandidates } from './scoring';
import { generateFallbackMeal } from './fallbacks';
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

  // Helper: record proteins/staples from a chosen meal
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
      const breakfastCandidates = rankMealCandidates(allMeals, foodItems, {
        mealType: 'breakfast',
        targetDate,
      });

      if (breakfastCandidates.length > 0) {
        const chosen = breakfastCandidates[0].meal;
        breakfastSlot = {
          mealType: 'breakfast',
          meal: chosen,
          isLeftover: false,
          isLocked: false,
        };
        recordMeal(chosen);
      } else {
        const fallback = generateFallbackMeal(
          foodItems.filter((i) => i.inStock),
          { mealType: 'breakfast' }
        );
        breakfastSlot = {
          mealType: 'breakfast',
          meal: fallback.meal,
          isLeftover: false,
          isLocked: false,
        };
        recordMeal(fallback.meal);
      }
    }
  }

  // 2. DINNER (decided before lunch to set the anchor)
  let dinnerSlot: DailyPlanSlot;

  if (currentPlan?.dinner?.isLocked && currentPlan.dinner.meal) {
    dinnerSlot = currentPlan.dinner;
    recordMeal(dinnerSlot.meal);
  } else {
    const dinnerCandidates = rankMealCandidates(allMeals, foodItems, {
      mealType: 'dinner',
      targetDate,
      excludedMealIds: Array.from(usedMealIds),
      usedProteins: new Set(usedProteins),
      usedStaples: new Set(usedStaples),
    });

    if (dinnerCandidates.length > 0) {
      const chosen = dinnerCandidates[0].meal;
      dinnerSlot = {
        mealType: 'dinner',
        meal: chosen,
        isLeftover: false,
        isLocked: false,
      };
      recordMeal(chosen);
    } else {
      const fallback = generateFallbackMeal(
        foodItems.filter((i) => i.inStock),
        { mealType: 'dinner' }
      );
      dinnerSlot = {
        mealType: 'dinner',
        meal: fallback.meal,
        isLeftover: false,
        isLocked: false,
      };
      recordMeal(fallback.meal);
    }
  }

  // 3. LUNCH (balanced against breakfast AND dinner — avoid protein/staple clashes)
  let lunchSlot: DailyPlanSlot;

  if (currentPlan?.lunch?.isLocked && currentPlan.lunch.meal) {
    lunchSlot = currentPlan.lunch;
  } else {
    const lunchCandidates = rankMealCandidates(allMeals, foodItems, {
      mealType: 'lunch',
      targetDate,
      excludedMealIds: Array.from(usedMealIds),
      usedProteins: new Set(usedProteins),
      usedStaples: new Set(usedStaples),
    });

    if (lunchCandidates.length > 0) {
      const chosen = lunchCandidates[0].meal;
      lunchSlot = {
        mealType: 'lunch',
        meal: chosen,
        isLeftover: false,
        isLocked: false,
      };
    } else {
      const fallback = generateFallbackMeal(
        foodItems.filter((i) => i.inStock),
        { mealType: 'lunch' }
      );
      lunchSlot = {
        mealType: 'lunch',
        meal: fallback.meal,
        isLeftover: false,
        isLocked: false,
      };
    }
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
  const exclusions = [...otherSlots.map((s) => currentPlan[s]?.meal?.id).filter(Boolean), currentMealId];

  const candidates = rankMealCandidates(allMeals, foodItems, {
    mealType: slotType,
    excludedMealIds: exclusions,
    usedProteins,
    usedStaples,
  });

  let newMeal: Meal;
  if (candidates.length > 0) {
    newMeal = candidates[0].meal;
  } else {
    const fallback = generateFallbackMeal(
      foodItems.filter((i) => i.inStock),
      { mealType: slotType }
    );
    newMeal = fallback.meal;
  }

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
