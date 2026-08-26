import { FoodItem, Meal, PlateComponent } from '@/lib/types';
import { DecisionCriteria } from './types';

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a single balanced meal from available food items.
 * Picks one item per role: STAPLE, PROTEIN/LEGUME, VEGETABLE/SALAD,
 * and optionally FRUIT, BEVERAGE based on meal type.
 */
function buildBalancedCombo(
  available: FoodItem[],
  excludeIds: Set<string>,
  mealType?: string,
): PlateComponent[] {
  const staples = available.filter((f) => f.category === 'staple' && !excludeIds.has(f.id));
  const proteins = available.filter((f) => f.category === 'protein' && !excludeIds.has(f.id));
  const legumes = available.filter((f) => f.category === 'legume' && !excludeIds.has(f.id));
  const vegetables = available.filter((f) => f.category === 'vegetable' && !excludeIds.has(f.id));
  const salads = available.filter((f) => f.category === 'salad' && !excludeIds.has(f.id));
  const fruits = available.filter((f) => f.category === 'fruit' && !excludeIds.has(f.id));
  const beverages = available.filter((f) => f.category === 'beverage' && !excludeIds.has(f.id));

  const plate: PlateComponent[] = [];

  // Always pick a staple
  if (staples.length > 0) {
    const s = pick(staples);
    plate.push({ role: 'STAPLE', name: s.name, foodItemId: s.id });
  }

  // Pick protein OR legume (never both in one meal)
  const proteinOptions = [...proteins, ...legumes];
  if (proteinOptions.length > 0) {
    const p = pick(proteinOptions);
    const role = p.category === 'legume' ? 'LEGUME' : 'PROTEIN';
    plate.push({ role, name: p.name, foodItemId: p.id });
  }

  // Pick vegetable or salad
  const vegOptions = [...vegetables, ...salads];
  if (vegOptions.length > 0) {
    const v = pick(vegOptions);
    const role = v.category === 'salad' ? 'SALAD' : 'VEGETABLE';
    plate.push({ role, name: v.name, foodItemId: v.id });
  }

  // For breakfast: add fruit + beverage
  if (mealType === 'breakfast') {
    if (fruits.length > 0) {
      const f = pick(fruits);
      plate.push({ role: 'FRUIT', name: f.name, foodItemId: f.id });
    }
    if (beverages.length > 0) {
      const b = pick(beverages);
      plate.push({ role: 'BEVERAGE', name: b.name, foodItemId: b.id });
    }
  }

  // For any meal: occasionally add a side
  if (mealType !== 'breakfast' && plate.length <= 3) {
    const extras = [...fruits, ...salads];
    if (extras.length > 0 && Math.random() > 0.5) {
      const e = pick(extras);
      const role = e.category === 'salad' ? 'SALAD' : 'FRUIT';
      plate.push({ role, name: e.name, foodItemId: e.id });
    }
  }

  return plate;
}

/**
 * Generate N unique balanced meals from available food items.
 * Each combo uses different ingredients for variety.
 */
export function generateDynamicMeals(
  foodItems: FoodItem[],
  count: number,
  mealType?: string,
  excludeMealNames?: Set<string>,
): Meal[] {
  const meals: Meal[] = [];
  const usedCombos = new Set<string>();
  const excludeNames = excludeMealNames || new Set();

  for (let i = 0; i < count && i < 20; i++) {
    const plate = buildBalancedCombo(foodItems, new Set(), mealType);

    // Skip if plate is too small (less than 2 components)
    if (plate.length < 2) continue;

    // Create a signature to avoid duplicate combos
    const sig = plate.map((p) => p.name).sort().join('|');
    if (usedCombos.has(sig) || excludeNames.has(sig)) continue;
    usedCombos.add(sig);

    const mealName = plate
      .map((p) => {
        const short = p.name
          .replace(/\(.*?\)/g, '')
          .replace(/Fresh |Steamed |Boiled |Fried |Raw /g, '')
          .trim();
        return short;
      })
      .join(' + ');

    meals.push({
      id: `dynamic-${mealType || 'any'}-${i}-${Date.now()}`,
      name: mealName,
      description: `Balanced combo from your available ingredients.`,
      mealType: (mealType as Meal['mealType']) || 'any',
      isQuick: true,
      source: 'default',
      plate,
    });
  }

  return meals;
}

/**
 * Generate a single fallback meal from available ingredients.
 */
export function generateFallbackMeal(
  inStockItems: FoodItem[],
  criteria: DecisionCriteria = {}
): { meal: Meal; reason: string } {
  if (!inStockItems || inStockItems.length === 0) {
    return {
      meal: {
        id: 'fallback-pantry-empty',
        name: 'Nothing Available',
        description: 'Mark some foods as available to get meal suggestions.',
        mealType: criteria.mealType || 'any',
        isQuick: true,
        source: 'default',
        plate: [],
      },
      reason: 'No foods marked as available. Go to My Food and mark items as in-stock.',
    };
  }

  const plate = buildBalancedCombo(inStockItems, new Set(), criteria.mealType);

  if (plate.length === 0) {
    const anyItem = pick(inStockItems);
    plate.push({ role: 'OTHER', name: anyItem.name, foodItemId: anyItem.id });
  }

  const mealName = plate.map((p) => p.name).join(' + ');

  return {
    meal: {
      id: `fallback-dynamic-${Date.now()}`,
      name: mealName,
      description: 'Assembled from what you have available right now.',
      mealType: criteria.mealType || 'any',
      isQuick: true,
      source: 'default',
      plate,
    },
    reason: 'Built a balanced plate from your available ingredients.',
  };
}
