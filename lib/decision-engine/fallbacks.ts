import { FoodItem, Meal, PlateComponent } from '@/lib/types';
import { DecisionCriteria } from './types';

export function generateFallbackMeal(
  inStockItems: FoodItem[],
  criteria: DecisionCriteria = {}
): { meal: Meal; reason: string } {
  if (!inStockItems || inStockItems.length === 0) {
    return {
      meal: {
        id: 'fallback-pantry-empty',
        name: 'Simple Steamed Rice & Fried Eggs',
        description: 'A comforting pantry standby assembled from essentials.',
        mealType: criteria.mealType || 'any',
        isQuick: true,
        source: 'default',
        plate: [
          { role: 'STAPLE', name: 'Steamed Rice' },
          { role: 'PROTEIN', name: 'Pan-Fried Eggs' },
        ],
      },
      reason: 'No pantry items currently marked in-stock. Showing our baseline pantry standby.',
    };
  }

  const staples = inStockItems.filter((i) => i.category === 'staple');
  const proteins = inStockItems.filter((i) => i.category === 'protein');
  const legumes = inStockItems.filter((i) => i.category === 'legume');
  const vegetables = inStockItems.filter((i) => i.category === 'vegetable');
  const salads = inStockItems.filter((i) => i.category === 'salad');
  const beverages = inStockItems.filter((i) => i.category === 'beverage');
  const fruits = inStockItems.filter((i) => i.category === 'fruit');

  const plate: PlateComponent[] = [];

  if (staples.length > 0) {
    const chosenStaple = staples[Math.floor(Math.random() * staples.length)];
    plate.push({
      role: 'STAPLE',
      name: chosenStaple.name,
      foodItemId: chosenStaple.id,
    });
  }

  if (proteins.length > 0) {
    const chosenProtein = proteins[Math.floor(Math.random() * proteins.length)];
    plate.push({
      role: 'PROTEIN',
      name: chosenProtein.name,
      foodItemId: chosenProtein.id,
    });
  } else if (legumes.length > 0) {
    const chosenLegume = legumes[Math.floor(Math.random() * legumes.length)];
    plate.push({
      role: 'LEGUME',
      name: chosenLegume.name,
      foodItemId: chosenLegume.id,
    });
  }

  if (vegetables.length > 0) {
    const chosenVeg = vegetables[Math.floor(Math.random() * vegetables.length)];
    plate.push({
      role: 'VEGETABLE',
      name: chosenVeg.name,
      foodItemId: chosenVeg.id,
    });
  } else if (salads.length > 0) {
    const chosenSalad = salads[Math.floor(Math.random() * salads.length)];
    plate.push({
      role: 'SALAD',
      name: chosenSalad.name,
      foodItemId: chosenSalad.id,
    });
  } else if (fruits.length > 0) {
    const chosenFruit = fruits[Math.floor(Math.random() * fruits.length)];
    plate.push({
      role: 'FRUIT',
      name: chosenFruit.name,
      foodItemId: chosenFruit.id,
    });
  }

  if ((criteria.mealType === 'breakfast' || plate.length < 2) && beverages.length > 0) {
    const chosenBev = beverages[Math.floor(Math.random() * beverages.length)];
    plate.push({
      role: 'BEVERAGE',
      name: chosenBev.name,
      foodItemId: chosenBev.id,
    });
  }

  if (plate.length === 0) {
    const anyItem = inStockItems[Math.floor(Math.random() * inStockItems.length)];
    plate.push({
      role: 'OTHER',
      name: anyItem.name,
      foodItemId: anyItem.id,
    });
  }

  const mealName = plate.map((p) => p.name).join(' + ');

  return {
    meal: {
      id: `fallback-dynamic-${Date.now()}`,
      name: mealName,
      description: 'Assembled from what you have in the kitchen today.',
      mealType: criteria.mealType || 'any',
      isQuick: true,
      source: 'default',
      plate,
    },
    reason: 'No pre-defined meals matched your criteria. We built a balanced plate from available ingredients.',
  };
}
