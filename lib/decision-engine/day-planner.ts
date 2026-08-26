import { DailyPlan, DailyPlanSlot, FoodItem, HistoryEntry, Meal, UserSettings } from '@/lib/types';
import { rankMealCandidates } from './scoring';
import { generateFallbackMeal } from './fallbacks';
import { generateLeftoverBreakfast } from './leftovers';

function getDominantProtein(meal: Meal): string | null {
  const proteinComp = meal.plate.find((p) => p.role === 'PROTEIN' || p.role === 'LEGUME');
  return proteinComp ? proteinComp.name.toLowerCase() : null;
}

function getDominantStaple(meal: Meal): string | null {
  const stapleComp = meal.plate.find((p) => p.role === 'STAPLE');
  return stapleComp ? stapleComp.name.toLowerCase() : null;
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

  // 1. BREAKFAST
  let breakfastSlot: DailyPlanSlot;

  if (currentPlan?.breakfast?.isLocked && currentPlan.breakfast.meal) {
    breakfastSlot = currentPlan.breakfast;
    usedMealIds.add(breakfastSlot.meal.id);
  } else {
    // Check for leftover breakfast first
    const leftover = generateLeftoverBreakfast(recentHistory, allMeals, settings);
    if (leftover) {
      breakfastSlot = {
        mealType: 'breakfast',
        meal: leftover.meal,
        isLeftover: true,
        isLocked: false,
      };
    } else {
      const breakfastCandidates = rankMealCandidates(allMeals, foodItems, {
        mealType: 'breakfast',
        targetDate,
      });

      if (breakfastCandidates.length > 0) {
        const chosen = breakfastCandidates[0].meal;
        usedMealIds.add(chosen.id);
        breakfastSlot = {
          mealType: 'breakfast',
          meal: chosen,
          isLeftover: false,
          isLocked: false,
        };
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
      }
    }
  }

  // 2. DINNER (Decided before lunch to prioritize the main dish of the day)
  let dinnerSlot: DailyPlanSlot;

  if (currentPlan?.dinner?.isLocked && currentPlan.dinner.meal) {
    dinnerSlot = currentPlan.dinner;
    usedMealIds.add(dinnerSlot.meal.id);
  } else {
    const dinnerCandidates = rankMealCandidates(allMeals, foodItems, {
      mealType: 'dinner',
      targetDate,
      excludedMealIds: Array.from(usedMealIds),
    });

    if (dinnerCandidates.length > 0) {
      const chosen = dinnerCandidates[0].meal;
      usedMealIds.add(chosen.id);
      dinnerSlot = {
        mealType: 'dinner',
        meal: chosen,
        isLeftover: false,
        isLocked: false,
      };
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
    }
  }

  // 3. LUNCH (Balanced against breakfast & dinner)
  let lunchSlot: DailyPlanSlot;

  if (currentPlan?.lunch?.isLocked && currentPlan.lunch.meal) {
    lunchSlot = currentPlan.lunch;
  } else {
    const dinnerProtein = getDominantProtein(dinnerSlot.meal);
    const dinnerStaple = getDominantStaple(dinnerSlot.meal);

    const lunchCandidates = rankMealCandidates(allMeals, foodItems, {
      mealType: 'lunch',
      targetDate,
      excludedMealIds: Array.from(usedMealIds),
    });

    // Try to find a lunch that doesn't clash with dinner's dominant protein/staple
    let chosenLunch: Meal | null = null;

    for (const cand of lunchCandidates) {
      const p = getDominantProtein(cand.meal);
      const s = getDominantStaple(cand.meal);
      const isClash = (p && dinnerProtein && p === dinnerProtein) || (s && dinnerStaple && s === dinnerStaple);
      if (!isClash) {
        chosenLunch = cand.meal;
        break;
      }
    }

    if (!chosenLunch && lunchCandidates.length > 0) {
      chosenLunch = lunchCandidates[0].meal;
    }

    if (chosenLunch) {
      lunchSlot = {
        mealType: 'lunch',
        meal: chosenLunch,
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
  const otherSlotMeals = [
    slotType !== 'breakfast' ? currentPlan.breakfast.meal.id : null,
    slotType !== 'lunch' ? currentPlan.lunch.meal.id : null,
    slotType !== 'dinner' ? currentPlan.dinner.meal.id : null,
  ].filter(Boolean) as string[];

  const currentMealId = currentPlan[slotType].meal.id;
  const exclusions = [...otherSlotMeals, currentMealId];

  const candidates = rankMealCandidates(allMeals, foodItems, {
    mealType: slotType,
    excludedMealIds: exclusions,
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
