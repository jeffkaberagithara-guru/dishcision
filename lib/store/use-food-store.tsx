'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DailyPlan,
  DecisionResult,
  FoodCategory,
  FoodItem,
  HistoryEntry,
  Meal,
  ShoppingItem,
  UserSettings,
} from '@/lib/types';
import { STARTER_FOOD_ITEMS, STARTER_MEALS } from '@/lib/data/starter-library';
import {
  DecisionCriteria,
  generateDailyPlan,
  generateShoppingListFromMeals,
  makeDishcision,
  regeneratePlanSlot as regenSlotEngine,
} from '@/lib/decision-engine';

interface FoodStoreContextType {
  isLoaded: boolean;
  foodItems: FoodItem[];
  meals: Meal[];
  history: HistoryEntry[];
  currentDecision: DecisionResult | null;
  temporaryExcludedMealIds: string[];
  dailyPlan: DailyPlan | null;
  shoppingList: ShoppingItem[];
  settings: UserSettings;

  // Food Item Actions
  addItem: (item: Omit<FoodItem, 'id'>) => void;
  updateItem: (id: string, updates: Partial<FoodItem>) => void;
  toggleInStock: (id: string) => void;
  deleteItem: (id: string) => void;

  // Meal Actions
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  updateMeal: (id: string, updates: Partial<Meal>) => void;
  deleteMeal: (id: string) => void;
  toggleMealFavorite: (id: string) => void;
  toggleMealExclusion: (id: string) => void; // Permanent "Never"

  // Decision Engine Actions
  makeNewDecision: (options?: DecisionCriteria) => DecisionResult;
  acceptCurrentDecision: (hadLeftovers?: boolean) => void;
  rejectCurrentDecisionNotToday: () => DecisionResult;
  rejectCurrentDecisionNotAvailable: () => DecisionResult;
  clearTemporaryExclusions: () => void;

  // Day Planner Actions
  generatePlan: (targetDate?: Date) => DailyPlan;
  regenerateSlot: (slot: 'breakfast' | 'lunch' | 'dinner') => void;
  toggleLockSlot: (slot: 'breakfast' | 'lunch' | 'dinner') => void;

  // Shopping List Actions
  refreshShoppingList: () => void;
  toggleShoppingItem: (id: string) => void;
  addCustomShoppingItem: (name: string, category: FoodCategory) => void;
  deleteShoppingItem: (id: string) => void;
  clearCheckedShoppingItems: () => void;

  // Settings & Storage Actions
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetToStarterLibrary: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  allowLeftoversForBreakfast: true,
  keepItEasyDefault: false,
  householdSize: 2,
  spicinessPreference: 'medium',
  theme: 'editorial-ivory',
};

const STORAGE_KEYS = {
  FOOD_ITEMS: 'dishcision_food_items_v1',
  MEALS: 'dishcision_meals_v1',
  HISTORY: 'dishcision_history_v1',
  DAILY_PLAN: 'dishcision_daily_plan_v1',
  SHOPPING: 'dishcision_shopping_v1',
  SETTINGS: 'dishcision_settings_v1',
};

const FoodStoreContext = createContext<FoodStoreContextType | undefined>(undefined);

export const FoodStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [foodItems, setFoodItems] = useState<FoodItem[]>(STARTER_FOOD_ITEMS);
  const [meals, setMeals] = useState<Meal[]>(STARTER_MEALS);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [temporaryExcludedMealIds, setTemporaryExcludedMealIds] = useState<string[]>([]);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [currentDecision, setCurrentDecision] = useState<DecisionResult | null>(null);
  const hydrationRef = React.useRef(true);

  // 1. Safe Client Hydration from localStorage
  useEffect(() => {
    if (!hydrationRef.current) return;
    hydrationRef.current = false;

    let parsedItems = STARTER_FOOD_ITEMS;
    let parsedMeals = STARTER_MEALS;
    let parsedHistory: HistoryEntry[] = [];
    let parsedPlan: DailyPlan | null = null;
    let parsedShopping: ShoppingItem[] = [];
    let parsedSettings = DEFAULT_SETTINGS;

    try {
      const savedItems = localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS);
      const savedMeals = localStorage.getItem(STORAGE_KEYS.MEALS);
      const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
      const savedPlan = localStorage.getItem(STORAGE_KEYS.DAILY_PLAN);
      const savedShopping = localStorage.getItem(STORAGE_KEYS.SHOPPING);
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);

      parsedItems = savedItems ? JSON.parse(savedItems) : STARTER_FOOD_ITEMS;
      parsedMeals = savedMeals ? JSON.parse(savedMeals) : STARTER_MEALS;
      parsedHistory = savedHistory ? JSON.parse(savedHistory) : [];
      parsedPlan = savedPlan ? JSON.parse(savedPlan) : null;
      parsedShopping = savedShopping ? JSON.parse(savedShopping) : [];
      parsedSettings = savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
    } catch (e) {
      console.warn('Could not load from localStorage, initializing defaults', e);
    }

    // Compute initial decision before setting state
    const initialDecision = makeDishcision(parsedMeals, parsedItems);

    // Batch all state updates using React 18+ automatic batching
    setFoodItems(parsedItems);
    setMeals(parsedMeals);
    setHistory(parsedHistory);
    setDailyPlan(parsedPlan);
    setShoppingList(parsedShopping);
    setSettings(parsedSettings);
    setCurrentDecision(initialDecision);
    setIsLoaded(true);
  }, []);

  // 2. Persistence Synchronization
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(foodItems));
    } catch (e) {
      console.error('Failed saving food items to storage', e);
    }
  }, [foodItems, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
    } catch (e) {
      console.error('Failed saving meals to storage', e);
    }
  }, [meals, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed saving history to storage', e);
    }
  }, [history, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (dailyPlan) {
        localStorage.setItem(STORAGE_KEYS.DAILY_PLAN, JSON.stringify(dailyPlan));
      }
    } catch (e) {
      console.error('Failed saving daily plan to storage', e);
    }
  }, [dailyPlan, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SHOPPING, JSON.stringify(shoppingList));
    } catch (e) {
      console.error('Failed saving shopping list to storage', e);
    }
  }, [shoppingList, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed saving settings to storage', e);
    }
  }, [settings, isLoaded]);

  // Food Item CRUD
  const addItem = useCallback((item: Omit<FoodItem, 'id'>) => {
    const newItem: FoodItem = {
      ...item,
      id: `f-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setFoodItems((prev) => [newItem, ...prev]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<FoodItem>) => {
    setFoodItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const toggleInStock = useCallback((id: string) => {
    setFoodItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, inStock: !item.inStock } : item))
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setFoodItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Meal CRUD
  const addMeal = useCallback((meal: Omit<Meal, 'id'>) => {
    const newMeal: Meal = {
      ...meal,
      id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setMeals((prev) => [newMeal, ...prev]);
  }, []);

  const updateMeal = useCallback((id: string, updates: Partial<Meal>) => {
    setMeals((prev) =>
      prev.map((meal) => (meal.id === id ? { ...meal, ...updates } : meal))
    );
  }, []);

  const deleteMeal = useCallback((id: string) => {
    setMeals((prev) => prev.filter((meal) => meal.id !== id));
  }, []);

  const toggleMealFavorite = useCallback((id: string) => {
    setMeals((prev) =>
      prev.map((meal) => (meal.id === id ? { ...meal, isFavorite: !meal.isFavorite } : meal))
    );
  }, []);

  const toggleMealExclusion = useCallback((id: string) => {
    setMeals((prev) =>
      prev.map((meal) => (meal.id === id ? { ...meal, isExcluded: !meal.isExcluded } : meal))
    );
  }, []);

  // Decision Operations
  const makeNewDecision = useCallback(
    (options: DecisionCriteria = {}) => {
      const mergedCriteria: DecisionCriteria = {
        excludedMealIds: [...temporaryExcludedMealIds, ...(options.excludedMealIds || [])],
        keepItEasy: options.keepItEasy ?? settings.keepItEasyDefault,
        ...options,
      };

      const result = makeDishcision(meals, foodItems, mergedCriteria);
      setCurrentDecision(result);
      return result;
    },
    [meals, foodItems, temporaryExcludedMealIds, settings]
  );

  const acceptCurrentDecision = useCallback(
    (hadLeftovers: boolean = true) => {
      if (!currentDecision) return;
      const nowIso = new Date().toISOString();

      // 1. Log to history
      const historyEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        mealId: currentDecision.meal.id,
        mealName: currentDecision.meal.name,
        plateSummary: currentDecision.meal.plate.map((p) => p.name).join(' + '),
        cookedAt: nowIso,
        hadLeftovers,
      };
      setHistory((prev) => [historyEntry, ...prev]);

      // 2. Update meal lastCooked timestamp
      if (!currentDecision.isFallback) {
        setMeals((prev) =>
          prev.map((m) => (m.id === currentDecision.meal.id ? { ...m, lastCooked: nowIso } : m))
        );
      }

      // 3. Clear temporary exclusions for fresh next session
      setTemporaryExcludedMealIds([]);
    },
    [currentDecision]
  );

  const rejectCurrentDecisionNotToday = useCallback(() => {
    const currentId = currentDecision?.meal.id;
    const nextExclusions = currentId
      ? [...temporaryExcludedMealIds, currentId]
      : temporaryExcludedMealIds;

    setTemporaryExcludedMealIds(nextExclusions);

    const result = makeDishcision(meals, foodItems, {
      excludedMealIds: nextExclusions,
      keepItEasy: settings.keepItEasyDefault,
    });
    setCurrentDecision(result);
    return result;
  }, [currentDecision, temporaryExcludedMealIds, meals, foodItems, settings]);

  const rejectCurrentDecisionNotAvailable = useCallback(() => {
    if (currentDecision && !currentDecision.isFallback) {
      // Mark ingredients belonging to this meal as out of stock
      const componentItemIds = currentDecision.meal.plate
        .map((p) => p.foodItemId)
        .filter(Boolean) as string[];

      if (componentItemIds.length > 0) {
        setFoodItems((prev) =>
          prev.map((item) =>
            componentItemIds.includes(item.id) ? { ...item, inStock: false } : item
          )
        );
      }
    }

    const currentId = currentDecision?.meal.id;
    const nextExclusions = currentId
      ? [...temporaryExcludedMealIds, currentId]
      : temporaryExcludedMealIds;

    setTemporaryExcludedMealIds(nextExclusions);

    const result = makeDishcision(meals, foodItems, {
      excludedMealIds: nextExclusions,
      mustUseInStockOnly: true,
    });
    setCurrentDecision(result);
    return result;
  }, [currentDecision, temporaryExcludedMealIds, meals, foodItems]);

  const clearTemporaryExclusions = useCallback(() => {
    setTemporaryExcludedMealIds([]);
  }, []);

  // Day Planner Operations
  const generatePlan = useCallback(
    (targetDate: Date = new Date()) => {
      const plan = generateDailyPlan(
        meals,
        foodItems,
        history,
        settings,
        targetDate,
        dailyPlan
      );
      setDailyPlan(plan);
      return plan;
    },
    [meals, foodItems, history, settings, dailyPlan]
  );

  const regenerateSlot = useCallback(
    (slot: 'breakfast' | 'lunch' | 'dinner') => {
      if (!dailyPlan) return;
      const updated = regenSlotEngine(slot, dailyPlan, meals, foodItems);
      setDailyPlan(updated);
    },
    [dailyPlan, meals, foodItems]
  );

  const toggleLockSlot = useCallback(
    (slot: 'breakfast' | 'lunch' | 'dinner') => {
      if (!dailyPlan) return;
      setDailyPlan((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          [slot]: {
            ...prev[slot],
            isLocked: !prev[slot].isLocked,
          },
        };
      });
    },
    [dailyPlan]
  );

  // Shopping List Operations
  const refreshShoppingList = useCallback(() => {
    const plannedMeals = dailyPlan
      ? [dailyPlan.breakfast.meal, dailyPlan.lunch.meal, dailyPlan.dinner.meal]
      : meals.slice(0, 5);

    const generated = generateShoppingListFromMeals(plannedMeals, foodItems, shoppingList);
    setShoppingList(generated);
  }, [dailyPlan, meals, foodItems, shoppingList]);

  const toggleShoppingItem = useCallback((id: string) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isChecked: !item.isChecked } : item))
    );
  }, []);

  const addCustomShoppingItem = useCallback((name: string, category: FoodCategory) => {
    const newItem: ShoppingItem = {
      id: `shop-custom-${Date.now()}`,
      name: name.trim(),
      category,
      isChecked: false,
      isCustom: true,
      sourceMealCount: 1,
    };
    setShoppingList((prev) => [newItem, ...prev]);
  }, []);

  const deleteShoppingItem = useCallback((id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCheckedShoppingItems = useCallback(() => {
    setShoppingList((prev) => prev.filter((item) => !item.isChecked));
  }, []);

  // Settings & Reset
  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetToStarterLibrary = useCallback(() => {
    setFoodItems(STARTER_FOOD_ITEMS);
    setMeals(STARTER_MEALS);
    setHistory([]);
    setTemporaryExcludedMealIds([]);
    setDailyPlan(null);
    setShoppingList([]);
    setSettings(DEFAULT_SETTINGS);
    const initialDecision = makeDishcision(STARTER_MEALS, STARTER_FOOD_ITEMS);
    setCurrentDecision(initialDecision);

    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Storage clear error', e);
    }
  }, []);

  return (
    <FoodStoreContext.Provider
      value={{
        isLoaded,
        foodItems,
        meals,
        history,
        currentDecision,
        temporaryExcludedMealIds,
        dailyPlan,
        shoppingList,
        settings,
        addItem,
        updateItem,
        toggleInStock,
        deleteItem,
        addMeal,
        updateMeal,
        deleteMeal,
        toggleMealFavorite,
        toggleMealExclusion,
        makeNewDecision,
        acceptCurrentDecision,
        rejectCurrentDecisionNotToday,
        rejectCurrentDecisionNotAvailable,
        clearTemporaryExclusions,
        generatePlan,
        regenerateSlot,
        toggleLockSlot,
        refreshShoppingList,
        toggleShoppingItem,
        addCustomShoppingItem,
        deleteShoppingItem,
        clearCheckedShoppingItems,
        updateSettings,
        resetToStarterLibrary,
      }}
    >
      {children}
    </FoodStoreContext.Provider>
  );
};

export const useFoodStore = () => {
  const context = useContext(FoodStoreContext);
  if (!context) {
    throw new Error('useFoodStore must be used within a FoodStoreProvider');
  }
  return context;
};

export default useFoodStore;
