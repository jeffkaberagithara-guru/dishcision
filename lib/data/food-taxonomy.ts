import { FoodCategory, MealType } from '@/lib/types';

export interface FoodParent {
  id: string;
  name: string;
  category: FoodCategory;
  mealTypes: MealType[];
  description?: string;
}

export interface FoodVariant {
  id: string;
  name: string;
  parentId: string;
  mealTypes: MealType[];
}

export const FOOD_PARENTS: FoodParent[] = [
  {
    id: 'fp-ugali', name: 'Ugali', category: 'staple',
    mealTypes: ['lunch', 'dinner'],
    description: 'Dense maize flour dough — the foundation of most Kenyan meals',
  },
  {
    id: 'fp-rice', name: 'Rice', category: 'staple',
    mealTypes: ['lunch', 'dinner'],
    description: 'Steamed or boiled rice',
  },
  {
    id: 'fp-potato', name: 'Potatoes', category: 'staple',
    mealTypes: ['lunch', 'dinner'],
    description: 'Irish potatoes — boiled, fried, or wedges',
  },
  {
    id: 'fp-roots', name: 'Roots & Tubers', category: 'staple',
    mealTypes: ['breakfast', 'lunch'],
    description: 'Nduma, Ngwaci, and similar traditional roots',
  },
  {
    id: 'fp-bread', name: 'Bread & Chapati', category: 'staple',
    mealTypes: ['breakfast', 'lunch'],
    description: 'Fresh bread, chapati, and toast',
  },
  {
    id: 'fp-githeri', name: 'Githeri', category: 'staple',
    mealTypes: ['lunch', 'dinner'],
    description: 'Boiled maize and legume combinations',
  },
  {
    id: 'fp-beef', name: 'Beef', category: 'protein',
    mealTypes: ['lunch', 'dinner'],
    description: 'Beef in various cuts and preparations',
  },
  {
    id: 'fp-pork', name: 'Pork', category: 'protein',
    mealTypes: ['lunch', 'dinner'],
    description: 'Pork chops, ribs, and stew meat',
  },
  {
    id: 'fp-eggs', name: 'Eggs', category: 'protein',
    mealTypes: ['breakfast', 'lunch', 'dinner'],
    description: 'Fresh eggs — scrambled, fried, or boiled',
  },
  {
    id: 'fp-sausages', name: 'Sausages', category: 'protein',
    mealTypes: ['breakfast', 'lunch'],
    description: 'Smoked or fresh sausages',
  },
  {
    id: 'fp-ndengu', name: 'Ndengu (Green Grams)', category: 'legume',
    mealTypes: ['lunch', 'dinner'],
    description: 'Green grams — stewed, mashed, or as mukimo',
  },
  {
    id: 'fp-beans', name: 'Beans', category: 'legume',
    mealTypes: ['lunch', 'dinner'],
    description: 'Yellow beans, njogo beans, and similar legumes',
  },
  {
    id: 'fp-peas', name: 'Peas (Minji)', category: 'legume',
    mealTypes: ['lunch', 'dinner'],
    description: 'Green peas — fresh or dried',
  },
  {
    id: 'fp-sukuma', name: 'Sukuma Wiki', category: 'vegetable',
    mealTypes: ['lunch', 'dinner'],
    description: 'Collard greens — the everyday Kenyan green',
  },
  {
    id: 'fp-cabbage', name: 'Cabbage', category: 'vegetable',
    mealTypes: ['lunch', 'dinner'],
    description: 'Fresh cabbage — steamed, fried, or in coleslaw',
  },
  {
    id: 'fp-spinach', name: 'Spinach', category: 'vegetable',
    mealTypes: ['lunch', 'dinner'],
    description: 'Fresh spinach leaves',
  },
  {
    id: 'fp-pumpkin-leaves', name: 'Pumpkin Leaves', category: 'vegetable',
    mealTypes: ['lunch', 'dinner'],
    description: 'Kahurura — used in mukimo and stews',
  },
  {
    id: 'fp-tomato', name: 'Tomatoes', category: 'vegetable',
    mealTypes: ['breakfast', 'lunch', 'dinner'],
    description: 'Fresh tomatoes — for cooking, sauces, and kachumbari',
  },
  {
    id: 'fp-onion', name: 'Onions', category: 'vegetable',
    mealTypes: ['breakfast', 'lunch', 'dinner'],
    description: 'Red onions — essential aromatic base',
  },
  {
    id: 'fp-kachumbari', name: 'Kachumbari', category: 'salad',
    mealTypes: ['lunch', 'dinner'],
    description: 'Fresh tomato-chili salsa',
  },
  {
    id: 'fp-salad', name: 'Green Salad', category: 'salad',
    mealTypes: ['lunch', 'dinner'],
    description: 'Fresh garden salad and coleslaw',
  },
  {
    id: 'fp-avocado', name: 'Avocado', category: 'fruit',
    mealTypes: ['breakfast', 'lunch', 'dinner'],
    description: 'Ripe avocado — sliced or mashed',
  },
  {
    id: 'fp-banana', name: 'Bananas', category: 'fruit',
    mealTypes: ['breakfast'],
    description: 'Fresh ripe bananas',
  },
  {
    id: 'fp-chai', name: 'Kenyan Chai', category: 'beverage',
    mealTypes: ['breakfast'],
    description: 'Spiced milk tea — the Kenyan morning staple',
  },
  {
    id: 'fp-coffee', name: 'Coffee', category: 'beverage',
    mealTypes: ['breakfast'],
    description: 'Kenyan coffee — black or with milk',
  },
  {
    id: 'fp-juice', name: 'Fresh Juice', category: 'beverage',
    mealTypes: ['breakfast', 'lunch'],
    description: 'Fresh fruit juices — passion, mango, etc.',
  },
];

export const FOOD_VARIANTS: FoodVariant[] = [
  // Ugali variants
  { id: 'f-1', name: 'Ugali Flour (Maize Flour)', parentId: 'fp-ugali', mealTypes: ['lunch', 'dinner'] },

  // Rice variants
  { id: 'f-2', name: 'Pishori Rice', parentId: 'fp-rice', mealTypes: ['lunch', 'dinner'] },

  // Potato variants
  { id: 'f-3', name: 'Irish Potatoes', parentId: 'fp-potato', mealTypes: ['lunch', 'dinner'] },

  // Roots variants
  { id: 'f-4', name: 'Nduma (Arrowroots)', parentId: 'fp-roots', mealTypes: ['breakfast', 'lunch'] },
  { id: 'f-5', name: 'Ngwaci (Sweet Potatoes)', parentId: 'fp-roots', mealTypes: ['breakfast', 'lunch'] },

  // Bread variants
  { id: 'f-6', name: 'Wheat Flour / Chapati Flour', parentId: 'fp-bread', mealTypes: ['breakfast', 'lunch'] },
  { id: 'f-7', name: 'Fresh Bread', parentId: 'fp-bread', mealTypes: ['breakfast', 'lunch'] },

  // Githeri variants
  { id: 'f-8', name: 'Githeri Maize (Boiled)', parentId: 'fp-githeri', mealTypes: ['lunch', 'dinner'] },

  // Beef variants
  { id: 'f-9', name: 'Beef Stew Meat', parentId: 'fp-beef', mealTypes: ['lunch', 'dinner'] },
  { id: 'f-10', name: 'Minced Beef', parentId: 'fp-beef', mealTypes: ['lunch', 'dinner'] },
  { id: 'f-12', name: 'Nyama Choma (Goat / Beef)', parentId: 'fp-beef', mealTypes: ['dinner'] },

  // Pork variants
  { id: 'f-11', name: 'Pork Meat / Pork Chops', parentId: 'fp-pork', mealTypes: ['lunch', 'dinner'] },

  // Eggs variants
  { id: 'f-13', name: 'Fresh Eggs', parentId: 'fp-eggs', mealTypes: ['breakfast', 'lunch', 'dinner'] },

  // Sausages variants
  { id: 'f-14', name: 'Sausages', parentId: 'fp-sausages', mealTypes: ['breakfast', 'lunch'] },
  { id: 'f-15', name: 'Bacon', parentId: 'fp-sausages', mealTypes: ['breakfast'] },

  // Ndengu variants
  { id: 'f-16', name: 'Ndengu (Green Grams)', parentId: 'fp-ndengu', mealTypes: ['lunch', 'dinner'] },

  // Beans variants
  { id: 'f-17', name: 'Yellow Beans (Kamande)', parentId: 'fp-beans', mealTypes: ['lunch', 'dinner'] },
  { id: 'f-19', name: 'Njogo Beans', parentId: 'fp-beans', mealTypes: ['lunch', 'dinner'] },

  // Peas variants
  { id: 'f-18', name: 'Peas (Minji)', parentId: 'fp-peas', mealTypes: ['lunch', 'dinner'] },

  // Sukuma variants
  { id: 'f-20', name: 'Sukuma Wiki (Collard Greens)', parentId: 'fp-sukuma', mealTypes: ['lunch', 'dinner'] },

  // Cabbage variants
  { id: 'f-21', name: 'Fresh Cabbage', parentId: 'fp-cabbage', mealTypes: ['lunch', 'dinner'] },

  // Spinach variants
  { id: 'f-22', name: 'Spinach', parentId: 'fp-spinach', mealTypes: ['lunch', 'dinner'] },

  // Pumpkin Leaves variants
  { id: 'f-23', name: 'Pumpkin Leaves (Kahurura)', parentId: 'fp-pumpkin-leaves', mealTypes: ['lunch', 'dinner'] },

  // Tomato variants
  { id: 'f-24', name: 'Tomatoes', parentId: 'fp-tomato', mealTypes: ['breakfast', 'lunch', 'dinner'] },

  // Onion variants
  { id: 'f-25', name: 'Red Onions', parentId: 'fp-onion', mealTypes: ['breakfast', 'lunch', 'dinner'] },

  // Kachumbari variants
  { id: 'f-26', name: 'Kachumbari (Fresh Salsa)', parentId: 'fp-kachumbari', mealTypes: ['lunch', 'dinner'] },

  // Salad variants
  { id: 'f-27', name: 'Coleslaw', parentId: 'fp-salad', mealTypes: ['lunch', 'dinner'] },
  { id: 'f-28', name: 'Garden Salad', parentId: 'fp-salad', mealTypes: ['lunch', 'dinner'] },

  // Avocado variants
  { id: 'f-29', name: 'Ripe Avocado', parentId: 'fp-avocado', mealTypes: ['breakfast', 'lunch', 'dinner'] },

  // Banana variants
  { id: 'f-30', name: 'Bananas', parentId: 'fp-banana', mealTypes: ['breakfast'] },

  // Chai variants
  { id: 'f-31', name: 'Kenyan Spiced Tea (Chai ya Tangawizi)', parentId: 'fp-chai', mealTypes: ['breakfast'] },

  // Coffee variants
  { id: 'f-33', name: 'Coffee', parentId: 'fp-coffee', mealTypes: ['breakfast'] },

  // Juice variants
  { id: 'f-34', name: 'Fresh Passion Juice', parentId: 'fp-juice', mealTypes: ['breakfast', 'lunch'] },
  { id: 'f-35', name: 'Kombucha / Tepache', parentId: 'fp-juice', mealTypes: ['lunch'] },

  // Pantry (no parent group — standalone)
  { id: 'f-32', name: 'Fresh Cow Milk', parentId: 'fp-chai', mealTypes: ['breakfast'] },
  { id: 'f-36', name: 'Cooking Oil', parentId: '', mealTypes: ['breakfast', 'lunch', 'dinner'] },
];

export function getParentForVariant(variantId: string): FoodParent | undefined {
  const variant = FOOD_VARIANTS.find((v) => v.id === variantId);
  if (!variant || !variant.parentId) return undefined;
  return FOOD_PARENTS.find((p) => p.id === variant.parentId);
}

export function getVariantsForParent(parentId: string): FoodVariant[] {
  return FOOD_VARIANTS.filter((v) => v.parentId === parentId);
}

export function getMealTypeLabel(mealTypes: MealType[]): string {
  if (mealTypes.length === 3) return 'Any meal';
  if (mealTypes.length === 1) return mealTypes[0];
  return mealTypes.join(', ');
}

export function isFoodAppropriateForMeal(foodMealTypes: MealType[], targetMealType: MealType): boolean {
  if (targetMealType === 'any') return true;
  return foodMealTypes.includes(targetMealType) || foodMealTypes.includes('any');
}

/**
 * Resolve the meal types a food item is suited for, using the taxonomy
 * (variant metadata first, then its parent group). Foods with no mapping
 * are treated as neutral (suitable anywhere).
 */
export function getFoodMealTypes(food: { id: string; parentId?: string }): MealType[] {
  const variant = FOOD_VARIANTS.find((v) => v.id === food.id);
  if (variant && variant.mealTypes.length > 0) return variant.mealTypes;
  if (food.parentId) {
    const parent = FOOD_PARENTS.find((p) => p.id === food.parentId);
    if (parent && parent.mealTypes.length > 0) return parent.mealTypes;
  }
  return [];
}

/**
 * Strict meal separation:
 * - Breakfast is its own menu. Only breakfast-type foods (or neutral ones)
 *   may be used for breakfast; main-meal foods are kept out.
 * - Lunch and dinner are interchangeable. Anything that is not strictly
 *   breakfast-only (i.e. includes lunch, dinner, or any) is allowed.
 */
export function isFoodAllowedForTargetMeal(
  foodMealTypes: MealType[],
  targetMealType: MealType
): boolean {
  if (!targetMealType || targetMealType === 'any') return true;
  if (foodMealTypes.length === 0) return true; // unclassified foods are neutral

  const isMainFood =
    foodMealTypes.includes('lunch') ||
    foodMealTypes.includes('dinner') ||
    foodMealTypes.includes('any');

  if (targetMealType === 'breakfast') {
    return foodMealTypes.includes('breakfast');
  }

  // Lunch or dinner — never let breakfast-only foods spill over.
  return isMainFood;
}
