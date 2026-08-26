'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { AddFoodItemModal } from '@/components/my-food/add-food-item-modal';
import { AddMealModal } from '@/components/my-food/add-meal-modal';
import { useFoodStore } from '@/lib/store/use-food-store';
import { FoodCategory, FoodItem, Meal } from '@/lib/types';
import { FOOD_PARENTS } from '@/lib/data/food-taxonomy';
import {
  Plus,
  Search,
  Trash2,
  Star,
  Ban,
  Utensils,
  ChevronDown,
  ChevronUp,
  Package,
  Beef,
  Leaf,
  Bean,
  Salad,
  Apple,
  Coffee,
  ShoppingCart,
  Edit3,
  Check,
  X,
  Zap,
} from 'lucide-react';

const CATEGORY_CONFIG: Record<FoodCategory, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  staple: { label: 'STAPLES', icon: Package, color: '#8A9B84' },
  protein: { label: 'PROTEINS', icon: Beef, color: '#B76546' },
  vegetable: { label: 'VEGETABLES', icon: Leaf, color: '#8A9B84' },
  legume: { label: 'LEGUMES', icon: Bean, color: '#6E6A61' },
  salad: { label: 'SALADS', icon: Salad, color: '#8A9B84' },
  fruit: { label: 'FRUIT', icon: Apple, color: '#B76546' },
  beverage: { label: 'BEVERAGES', icon: Coffee, color: '#6E6A61' },
  pantry: { label: 'PANTRY', icon: ShoppingCart, color: '#6E6A61' },
};

const CATEGORY_ORDER: FoodCategory[] = ['staple', 'protein', 'legume', 'vegetable', 'salad', 'fruit', 'beverage', 'pantry'];

type TabKey = 'cookbook' | 'stocked' | 'meals';

interface FoodGroup {
  parentName: string;
  parentId: string | undefined;
  items: FoodItem[];
}

export default function MyFoodPage() {
  const {
    foodItems,
    meals,
    addItem,
    deleteItem,
    toggleInStock,
    addMeal,
    updateMeal,
    deleteMeal,
    toggleMealFavorite,
    toggleMealExclusion,
    isLoaded,
  } = useFoodStore();

  const [activeTab, setActiveTab] = useState<TabKey>('cookbook');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [editingMealName, setEditingMealName] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<FoodCategory>>(new Set(CATEGORY_ORDER));
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'food' | 'meal'>('food');

  const filteredMeals = useMemo(() => {
    if (!searchQuery.trim()) return meals;
    const q = searchQuery.toLowerCase();
    return meals.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q) ||
        m.plate.some((p) => p.name.toLowerCase().includes(q))
    );
  }, [meals, searchQuery]);

  const filteredFoodItems = useMemo(() => {
    if (!searchQuery.trim()) return foodItems;
    const q = searchQuery.toLowerCase();
    return foodItems.filter(
      (f) => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
    );
  }, [foodItems, searchQuery]);

  // Group foods by parent for "Foods I Can Cook" tab
  const groupedByParent = useMemo(() => {
    const groups: Record<FoodCategory, FoodGroup[]> = {
      staple: [], protein: [], vegetable: [], legume: [],
      salad: [], fruit: [], beverage: [], pantry: [],
    };

    const parentMap = new Map<string, FoodGroup>();
    const standalone: Record<FoodCategory, FoodItem[]> = {
      staple: [], protein: [], vegetable: [], legume: [],
      salad: [], fruit: [], beverage: [], pantry: [],
    };

    filteredFoodItems.forEach((item) => {
      if (item.parentId) {
        if (!parentMap.has(item.parentId)) {
          const parent = FOOD_PARENTS.find((p) => p.id === item.parentId);
          const group: FoodGroup = {
            parentName: parent?.name || item.name,
            parentId: item.parentId,
            items: [],
          };
          parentMap.set(item.parentId, group);
          groups[item.category].push(group);
        }
        parentMap.get(item.parentId)!.items.push(item);
      } else {
        standalone[item.category].push(item);
      }
    });

    // Add standalone items as individual groups
    Object.keys(standalone).forEach((cat) => {
      const catKey = cat as FoodCategory;
      standalone[catKey].forEach((item) => {
        groups[catKey].push({
          parentName: item.name,
          parentId: undefined,
          items: [item],
        });
      });
    });

    return groups;
  }, [filteredFoodItems]);

  // Simple category grouping for "Available Now" tab
  const groupedForStock = useMemo(() => {
    const groups: Record<FoodCategory, FoodItem[]> = {
      staple: [], protein: [], vegetable: [], legume: [],
      salad: [], fruit: [], beverage: [], pantry: [],
    };
    filteredFoodItems.forEach((item) => {
      if (groups[item.category]) groups[item.category].push(item);
    });
    return groups;
  }, [filteredFoodItems]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const toggleCategory = (cat: FoodCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    if (deleteType === 'food') deleteItem(deleteConfirmId);
    else deleteMeal(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  const handleStartEditMeal = (meal: Meal) => {
    setEditingMealId(meal.id);
    setEditingMealName(meal.name);
  };

  const handleSaveEditMeal = (id: string) => {
    if (editingMealName.trim()) {
      updateMeal(id, { name: editingMealName.trim() });
    }
    setEditingMealId(null);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] flex flex-col justify-between">
        <Header />
        <main className="container-editorial py-24 text-center">
          <p className="font-serif italic text-xl text-[#6E6A61]">Loading your pantry...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const inStockCount = foodItems.filter((f) => f.inStock).length;

  const TABS: { key: TabKey; label: string; count: number }[] = [
    { key: 'cookbook', label: 'FOODS I CAN COOK', count: foodItems.length },
    { key: 'stocked', label: 'AVAILABLE NOW', count: inStockCount },
    { key: 'meals', label: 'MEALS', count: meals.length },
  ];

  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="container-editorial w-full max-w-5xl flex-1 py-8 sm:py-12 md:py-20 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-semibold text-[#8A9B84] block">
              YOUR FOOD LIBRARY
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#171714] font-normal">
              Your Food.
            </h1>
            <p className="font-serif italic text-lg sm:text-xl text-[#6E6A61]">
              Everything you already know how to cook.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="md" onClick={() => setIsAddFoodOpen(true)} className="gap-2 flex-1 sm:flex-none">
              <Plus className="w-4 h-4" /> Add Food
            </Button>
            <Button variant="primary" size="md" onClick={() => setIsAddMealOpen(true)} className="gap-2 flex-1 sm:flex-none">
              <Plus className="w-4 h-4" /> Add Meal
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A61]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search meals and ingredients..."
            className="w-full pl-10 pr-4 min-h-11 border border-[#DCD5C9] bg-white text-sm text-[#171714] rounded-[2px] focus:outline-none focus:border-[#8A9B84]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6A61] hover:text-[#171714] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 border-b border-[#DCD5C9] overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-xs uppercase tracking-widest font-sans font-medium transition-colors border-b-2 -mb-px whitespace-nowrap cursor-pointer ${
                activeTab === tab.key
                  ? 'text-[#171714] border-[#171714]'
                  : 'text-[#6E6A61] border-transparent hover:text-[#171714]'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* COOKBOOK TAB — Foods I Can Cook */}
        {activeTab === 'cookbook' && (
          <div className="space-y-4">
            {filteredFoodItems.length === 0 ? (
              <div className="p-12 bg-white border border-[#DCD5C9] rounded-[2px] text-center space-y-4">
                <Package className="w-10 h-10 text-[#DCD5C9] mx-auto" />
                <h2 className="font-serif text-2xl text-[#171714]">
                  {searchQuery ? 'No foods match your search.' : 'Your food library is empty.'}
                </h2>
                <p className="text-sm text-[#6E6A61]">
                  {searchQuery ? 'Try a different search term.' : 'Add the food you already know how to cook.'}
                </p>
                {!searchQuery && (
                  <Button variant="primary" size="md" onClick={() => setIsAddFoodOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Your First Food
                  </Button>
                )}
              </div>
            ) : (
              CATEGORY_ORDER.map((cat) => {
                const groups = groupedByParent[cat];
                if (groups.length === 0) return null;
                const config = CATEGORY_CONFIG[cat];
                const Icon = config.icon;
                const isExpanded = expandedCategories.has(cat);
                const catItemCount = groups.reduce((sum, g) => sum + g.items.length, 0);

                return (
                  <div key={cat} className="bg-white border border-[#DCD5C9] rounded-[2px] overflow-hidden">
                    <button
                      onClick={() => toggleCategory(cat)}
                      className="w-full px-4 sm:px-5 py-3 flex items-center justify-between hover:bg-[#F7F3EC]/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#171714]">
                          {config.label}
                        </span>
                        <Badge variant="muted" size="sm">{catItemCount}</Badge>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#6E6A61]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#6E6A61]" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="border-t border-[#DCD5C9] divide-y divide-[#DCD5C9]/50">
                        {groups.map((group) => {
                          const hasMultiple = group.items.length > 1;
                          const groupExpanded = expandedGroups.has(group.parentId || group.items[0].id);
                          const allInStock = group.items.every((i) => i.inStock);
                          const someInStock = group.items.some((i) => i.inStock);

                          return (
                            <div key={group.parentId || group.items[0].id}>
                              {/* Group header */}
                              <div
                                className={`px-4 sm:px-5 py-3 flex items-center justify-between gap-3 transition-colors ${
                                  hasMultiple ? 'hover:bg-[#F7F3EC]/30 cursor-pointer' : ''
                                }`}
                                onClick={hasMultiple ? () => toggleGroup(group.parentId || group.items[0].id) : undefined}
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {hasMultiple ? (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); toggleGroup(group.parentId || group.items[0].id); }}
                                      className="cursor-pointer"
                                    >
                                      {groupExpanded ? (
                                        <ChevronUp className="w-4 h-4 text-[#6E6A61]" />
                                      ) : (
                                        <ChevronDown className="w-4 h-4 text-[#6E6A61]" />
                                      )}
                                    </button>
                                  ) : (
                                    <div className="w-4" />
                                  )}
                                  <div className="min-w-0">
                                    <span className={`text-sm font-sans font-medium block truncate ${
                                      allInStock ? 'text-[#171714]' : someInStock ? 'text-[#6E6A61]' : 'text-[#6E6A61] line-through'
                                    }`}>
                                      {group.parentName}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  {hasMultiple && (
                                    <Badge variant="muted" size="sm">{group.items.length} VARIANTS</Badge>
                                  )}
                                  {allInStock && (
                                    <Badge variant="sage" size="sm">IN STOCK</Badge>
                                  )}
                                </div>
                              </div>

                              {/* Variant items */}
                              {(!hasMultiple || groupExpanded) && (
                                <div className="border-t border-[#DCD5C9]/50 divide-y divide-[#DCD5C9]/30">
                                  {group.items.map((item) => (
                                    <div
                                      key={item.id}
                                      className={`px-4 sm:px-5 py-3 flex items-center justify-between gap-3 hover:bg-[#F7F3EC]/30 transition-colors ${
                                        hasMultiple ? 'pl-12' : ''
                                      }`}
                                    >
                                      <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <button
                                          onClick={() => toggleInStock(item.id)}
                                          className={`w-5 h-5 rounded-[2px] border flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                                            item.inStock
                                              ? 'bg-[#8A9B84] border-[#8A9B84] text-white'
                                              : 'border-[#DCD5C9] bg-white hover:border-[#8A9B84]/50'
                                          }`}
                                          title={item.inStock ? 'Mark out of stock' : 'Mark in stock'}
                                        >
                                          {item.inStock && <Check className="w-3 h-3" />}
                                        </button>
                                        <div className="min-w-0">
                                          <span className={`text-sm font-sans block truncate ${item.inStock ? 'text-[#171714]' : 'text-[#6E6A61] line-through'}`}>
                                            {item.name}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1 shrink-0">
                                        {item.isStaple && (
                                          <Badge variant="muted" size="sm">STAPLE</Badge>
                                        )}
                                        <button
                                          onClick={() => { setDeleteConfirmId(item.id); setDeleteType('food'); }}
                                          className="p-1.5 text-[#6E6A61] hover:text-[#B76546] rounded-[2px] transition-colors cursor-pointer"
                                          title="Delete item"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* AVAILABLE NOW TAB — Quick Stock Toggle */}
        {activeTab === 'stocked' && (
          <div className="space-y-4">
            <div className="p-4 bg-white border border-[#DCD5C9] rounded-[2px] flex items-center gap-3">
              <Zap className="w-4 h-4 text-[#8A9B84] shrink-0" />
              <p className="text-xs text-[#6E6A61] font-sans">
                Quick toggle what&apos;s physically in stock right now. Unchecked items won&apos;t appear in your DISHCISION.
              </p>
            </div>

            {filteredFoodItems.length === 0 ? (
              <div className="p-12 bg-white border border-[#DCD5C9] rounded-[2px] text-center space-y-4">
                <Package className="w-10 h-10 text-[#DCD5C9] mx-auto" />
                <h2 className="font-serif text-2xl text-[#171714]">
                  {searchQuery ? 'No foods match your search.' : 'No foods in your library.'}
                </h2>
                <p className="text-sm text-[#6E6A61]">
                  Add foods in the &quot;Foods I Can Cook&quot; tab first, then toggle their stock here.
                </p>
              </div>
            ) : (
              CATEGORY_ORDER.map((cat) => {
                const items = groupedForStock[cat];
                if (items.length === 0) return null;
                const config = CATEGORY_CONFIG[cat];
                const Icon = config.icon;
                const isExpanded = expandedCategories.has(cat);
                const inStockInCat = items.filter((i) => i.inStock).length;

                return (
                  <div key={cat} className="bg-white border border-[#DCD5C9] rounded-[2px] overflow-hidden">
                    <button
                      onClick={() => toggleCategory(cat)}
                      className="w-full px-4 sm:px-5 py-3 flex items-center justify-between hover:bg-[#F7F3EC]/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#171714]">
                          {config.label}
                        </span>
                        <Badge variant="muted" size="sm">{inStockInCat}/{items.length}</Badge>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#6E6A61]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#6E6A61]" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="border-t border-[#DCD5C9] divide-y divide-[#DCD5C9]/50">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3 hover:bg-[#F7F3EC]/30 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <button
                                onClick={() => toggleInStock(item.id)}
                                className={`w-5 h-5 rounded-[2px] border flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                                  item.inStock
                                    ? 'bg-[#8A9B84] border-[#8A9B84] text-white'
                                    : 'border-[#DCD5C9] bg-white hover:border-[#8A9B84]/50'
                                }`}
                                title={item.inStock ? 'Mark out of stock' : 'Mark in stock'}
                              >
                                {item.inStock && <Check className="w-3 h-3" />}
                              </button>
                              <span className={`text-sm font-sans truncate ${item.inStock ? 'text-[#171714]' : 'text-[#6E6A61] line-through'}`}>
                                {item.name}
                              </span>
                            </div>
                            {item.isStaple && (
                              <Badge variant="muted" size="sm">STAPLE</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* MEALS TAB */}
        {activeTab === 'meals' && (
          <div className="space-y-3">
            {filteredMeals.length === 0 ? (
              <div className="p-12 bg-white border border-[#DCD5C9] rounded-[2px] text-center space-y-4">
                <Utensils className="w-10 h-10 text-[#DCD5C9] mx-auto" />
                <h2 className="font-serif text-2xl text-[#171714]">
                  {searchQuery ? 'No meals match your search.' : 'Your meal library is empty.'}
                </h2>
                <p className="text-sm text-[#6E6A61]">
                  {searchQuery ? 'Try a different search term.' : 'Add the meals you already know how to cook.'}
                </p>
                {!searchQuery && (
                  <Button variant="primary" size="md" onClick={() => setIsAddMealOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Your First Meal
                  </Button>
                )}
              </div>
            ) : (
              filteredMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-white border border-[#DCD5C9] rounded-[2px] p-4 sm:p-5 space-y-3 hover:border-[#8A9B84]/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {meal.mealType && meal.mealType !== 'any' && (
                          <Badge variant="muted" size="sm">{meal.mealType}</Badge>
                        )}
                        {meal.isQuick && <Badge variant="sage" size="sm">QUICK</Badge>}
                        {meal.isFavorite && <Star className="w-3.5 h-3.5 text-[#B76546] fill-[#B76546]" />}
                        {meal.isExcluded && <Badge variant="terracotta" size="sm">NEVER</Badge>}
                      </div>
                      {editingMealId === meal.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingMealName}
                            onChange={(e) => setEditingMealName(e.target.value)}
                            className="flex-1 px-2 py-1 border border-[#8A9B84] bg-white text-sm rounded-[2px] min-h-9"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEditMeal(meal.id);
                              if (e.key === 'Escape') setEditingMealId(null);
                            }}
                          />
                          <button onClick={() => handleSaveEditMeal(meal.id)} className="p-1 text-[#8A9B84] hover:text-[#54684E] cursor-pointer">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingMealId(null)} className="p-1 text-[#6E6A61] hover:text-[#171714] cursor-pointer">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <h3 className="font-serif text-lg sm:text-xl text-[#171714] font-medium truncate">
                          {meal.name}
                        </h3>
                      )}
                      {meal.description && (
                        <p className="text-xs text-[#6E6A61] line-clamp-2">{meal.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Plate breakdown */}
                  <div className="flex flex-wrap gap-1.5">
                    {meal.plate.map((p, i) => (
                      <span
                        key={i}
                        className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-[#F7F3EC] border border-[#DCD5C9] text-[#171714] rounded-[2px] font-medium"
                      >
                        {p.role}: {p.name}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1 border-t border-[#DCD5C9]/50">
                    <button
                      onClick={() => toggleMealFavorite(meal.id)}
                      className={`p-1.5 rounded-[2px] transition-colors cursor-pointer ${
                        meal.isFavorite ? 'text-[#B76546]' : 'text-[#6E6A61] hover:text-[#B76546]'
                      }`}
                      title={meal.isFavorite ? 'Remove favorite' : 'Mark as favorite'}
                    >
                      <Star className={`w-4 h-4 ${meal.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => toggleMealExclusion(meal.id)}
                      className={`p-1.5 rounded-[2px] transition-colors cursor-pointer ${
                        meal.isExcluded ? 'text-[#B76546]' : 'text-[#6E6A61] hover:text-[#B76546]'
                      }`}
                      title={meal.isExcluded ? 'Allow this meal' : 'Never recommend this'}
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStartEditMeal(meal)}
                      className="p-1.5 text-[#6E6A61] hover:text-[#171714] rounded-[2px] transition-colors cursor-pointer"
                      title="Rename meal"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setDeleteConfirmId(meal.id); setDeleteType('meal'); }}
                      className="p-1.5 text-[#6E6A61] hover:text-[#B76546] rounded-[2px] transition-colors ml-auto cursor-pointer"
                      title="Delete meal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <AddFoodItemModal isOpen={isAddFoodOpen} onClose={() => setIsAddFoodOpen(false)} onAdd={addItem} />
      <AddMealModal isOpen={isAddMealOpen} onClose={() => setIsAddMealOpen(false)} onAdd={addMeal} />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6E6A61]">
            Are you sure you want to delete this {deleteType}? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="md" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="md" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
      <BottomNav />
    </div>
  );
}
