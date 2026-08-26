import { FoodItem, Meal, PlateComponent } from '@/lib/types';
import { DecisionCriteria } from './types';

export function generateFallbackMeal(
  inStockItems: FoodItem[],
  criteria: DecisionCriteria = {}
): { meal: Meal; reason: string } {
  // If no items at all are in stock
  if (!inStockItems || inStockItems.length === 0) {
    return {
      meal: {
        id: 'fallback-pantry-empty',
        name: 'Simple Steamed Rice & Fried Eggs',
        description: 'A comforting pantry standby assembled from essentials.',
        mealType: criteria.mealType || 'any',
        isQuick: true,
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1200&auto=format&fit=crop',
        source: 'default',
        plate: [
          { role: 'STAPLE', name: 'Steamed Rice' },
          { role: 'PROTEIN', name: 'Pan-Fried Eggs' },
        ],
      },
      reason: 'No pantry items currently marked in-stock. Showing our baseline pantry standby.',
    };
  }

  // Categorize available in-stock items
  const staples = inStockItems.filter((i) => i.category === 'staple');
  const proteins = inStockItems.filter((i) => i.category === 'protein');
  const legumes = inStockItems.filter((i) => i.category === 'legume');
  const vegetables = inStockItems.filter((i) => i.category === 'vegetable');
  const salads = inStockItems.filter((i) => i.category === 'salad');
  const beverages = inStockItems.filter((i) => i.category === 'beverage');
  const fruits = inStockItems.filter((i) => i.category === 'fruit');

  const plate: PlateComponent[] = [];

  // Pick Staple
  if (staples.length > 0) {
    const chosenStaple = staples[0];
    plate.push({
      role: 'STAPLE',
      name: chosenStaple.name,
      foodItemId: chosenStaple.id,
    });
  }

  // Pick Protein or Legume
  if (proteins.length > 0) {
    const chosenProtein = proteins[0];
    plate.push({
      role: 'PROTEIN',
      name: chosenProtein.name,
      foodItemId: chosenProtein.id,
    });
  } else if (legumes.length > 0) {
    const chosenLegume = legumes[0];
    plate.push({
      role: 'LEGUME',
      name: chosenLegume.name,
      foodItemId: chosenLegume.id,
    });
  }

  // Pick Vegetable, Salad, or Fruit
  if (vegetables.length > 0) {
    const chosenVeg = vegetables[0];
    plate.push({
      role: 'VEGETABLE',
      name: chosenVeg.name,
      foodItemId: chosenVeg.id,
    });
  } else if (salads.length > 0) {
    const chosenSalad = salads[0];
    plate.push({
      role: 'SALAD',
      name: chosenSalad.name,
      foodItemId: chosenSalad.id,
    });
  } else if (fruits.length > 0) {
    const chosenFruit = fruits[0];
    plate.push({
      role: 'FRUIT',
      name: chosenFruit.name,
      foodItemId: chosenFruit.id,
    });
  }

  // If breakfast or plate is small, check beverage
  if ((criteria.mealType === 'breakfast' || plate.length < 2) && beverages.length > 0) {
    const chosenBev = beverages[0];
    plate.push({
      role: 'BEVERAGE',
      name: chosenBev.name,
      foodItemId: chosenBev.id,
    });
  }

  // If we still have an empty plate (e.g. only fruits or only spices)
  if (plate.length === 0) {
    const anyItem = inStockItems[0];
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
      description: 'We worked with what you have in the kitchen today.',
      mealType: criteria.mealType || 'any',
      isQuick: true,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop',
      source: 'default',
      plate,
    },
    reason: 'We worked with what you have.',
  };
}
