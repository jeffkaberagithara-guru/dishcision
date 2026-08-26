import { FoodCategory, FoodItem, Meal, ShoppingItem } from '@/lib/types';

function inferCategoryFromName(name: string, foodItems: FoodItem[]): FoodCategory {
  const lower = name.toLowerCase();

  const matched = foodItems.find(
    (f) => f.name.toLowerCase().includes(lower) || lower.includes(f.name.toLowerCase())
  );
  if (matched) return matched.category;

  if (lower.includes('rice') || lower.includes('ugali') || lower.includes('flour') || lower.includes('potato') || lower.includes('bread') || lower.includes('nduma') || lower.includes('ngwaci') || lower.includes('mukimo') || lower.includes('githeri')) {
    return 'staple';
  }
  if (lower.includes('beef') || lower.includes('pork') || lower.includes('goat') || lower.includes('choma') || lower.includes('egg') || lower.includes('sausage') || lower.includes('bacon') || lower.includes('meat') || lower.includes('chicken') || lower.includes('fish')) {
    return 'protein';
  }
  if (lower.includes('bean') || lower.includes('ndengu') || lower.includes('gram') || lower.includes('peas') || lower.includes('minji') || lower.includes('njogo')) {
    return 'legume';
  }
  if (lower.includes('sukuma') || lower.includes('cabbage') || lower.includes('spinach') || lower.includes('onion') || lower.includes('tomato') || lower.includes('greens') || lower.includes('leaves') || lower.includes('pepper')) {
    return 'vegetable';
  }
  if (lower.includes('kachumbari') || lower.includes('salad') || lower.includes('coleslaw')) {
    return 'salad';
  }
  if (lower.includes('tea') || lower.includes('chai') || lower.includes('coffee') || lower.includes('milk') || lower.includes('juice') || lower.includes('kombucha') || lower.includes('tepache')) {
    return 'beverage';
  }
  if (lower.includes('avocado') || lower.includes('banana') || lower.includes('fruit')) {
    return 'fruit';
  }
  return 'pantry';
}

function normalizeItemName(name: string): string {
  // Strip cooking methods like "Fried", "Steamed", "Spiced", "Rich", "Toasted" for cleaner shopping items
  return name
    .replace(/\b(Steamed|Fried|Boiled|Pan-Fried|Toasted|Rich|Spiced|Fresh|Sliced)\b/gi, '')
    .trim();
}

export function generateShoppingListFromMeals(
  meals: Meal[],
  foodItems: FoodItem[],
  existingShoppingItems: ShoppingItem[] = []
): ShoppingItem[] {
  const itemMap = new Map<string, { name: string; category: FoodCategory; count: number }>();

  // Aggregate items from meals
  meals.forEach((meal) => {
    meal.plate.forEach((comp) => {
      const normalized = normalizeItemName(comp.name);
      const key = normalized.toLowerCase();

      if (itemMap.has(key)) {
        itemMap.get(key)!.count += 1;
      } else {
        const category = inferCategoryFromName(comp.name, foodItems);
        itemMap.set(key, {
          name: normalized,
          category,
          count: 1,
        });
      }
    });
  });

  const existingCheckedMap = new Map<string, boolean>();
  existingShoppingItems.forEach((item) => {
    existingCheckedMap.set(item.name.toLowerCase(), item.isChecked);
  });

  const generatedItems: ShoppingItem[] = [];

  itemMap.forEach(({ name, category, count }, key) => {
    generatedItems.push({
      id: `shop-${key.replace(/[^a-z0-9]/g, '-')}`,
      name,
      category,
      isChecked: existingCheckedMap.get(key) || false,
      sourceMealCount: count,
      isCustom: false,
    });
  });

  // Preserve user custom additions
  const customItems = existingShoppingItems.filter((i) => i.isCustom);
  customItems.forEach((c) => {
    if (!itemMap.has(c.name.toLowerCase())) {
      generatedItems.push(c);
    }
  });

  return generatedItems;
}
