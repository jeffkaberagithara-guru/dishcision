import { HistoryEntry, Meal, UserSettings } from '@/lib/types';

export function generateLeftoverBreakfast(
  recentHistory: HistoryEntry[],
  allMeals: Meal[],
  settings: UserSettings
): { meal: Meal; isLeftover: boolean } | null {
  if (!settings.allowLeftoversForBreakfast) {
    return null;
  }

  if (!recentHistory || recentHistory.length === 0) {
    return null;
  }

  // Look for dinner cooked in the last 24 hours
  const now = new Date().getTime();
  const lastDinner = recentHistory.find((entry) => {
    const cookedTime = new Date(entry.cookedAt).getTime();
    const hoursAgo = (now - cookedTime) / (1000 * 60 * 60);
    return hoursAgo <= 24 && entry.hadLeftovers !== false;
  });

  if (!lastDinner) {
    return null;
  }

  const originalMeal = allMeals.find((m) => m.id === lastDinner.mealId);
  const baseName = originalMeal ? originalMeal.name : lastDinner.mealName;

  const leftoverMeal: Meal = {
    id: `leftover-${lastDinner.mealId}-${Date.now()}`,
    name: `Leftover ${baseName} + Spiced Chai`,
    description: `Warmed leftover from yesterday's dinner paired with fresh hot tea. Zero waste, zero morning effort.`,
    mealType: 'breakfast',
    isQuick: true,
    image: originalMeal?.image || 'https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=1200&auto=format&fit=crop',
    cookingTimeMinutes: 10,
    tags: ['leftover', 'zero-waste', 'quick-morning'],
    plate: originalMeal
      ? [
          ...originalMeal.plate.filter((p) => p.role === 'STAPLE' || p.role === 'PROTEIN' || p.role === 'LEGUME'),
          { role: 'BEVERAGE', name: 'Kenyan Spiced Chai' },
        ]
      : [
          { role: 'STAPLE', name: `Leftover ${baseName}` },
          { role: 'BEVERAGE', name: 'Kenyan Spiced Chai' },
        ],
  };

  return {
    meal: leftoverMeal,
    isLeftover: true,
  };
}
