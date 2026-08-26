'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Button } from '@/components/ui/button';
import { useFoodStore } from '@/lib/store/use-food-store';
import { FoodCategory } from '@/lib/types';
import { Check, Plus, RefreshCw, ShoppingBag, Trash2 } from 'lucide-react';

const CATEGORIES: FoodCategory[] = ['staple', 'protein', 'vegetable', 'legume', 'salad', 'fruit', 'beverage', 'pantry'];

const CATEGORY_LABELS: Record<FoodCategory, string> = {
  staple: 'STAPLES',
  protein: 'PROTEINS',
  vegetable: 'VEGETABLES',
  legume: 'LEGUMES',
  salad: 'SALADS',
  fruit: 'FRUIT',
  beverage: 'BEVERAGES',
  pantry: 'PANTRY',
};

export default function ShoppingPage() {
  const {
    shoppingList,
    refreshShoppingList,
    toggleShoppingItem,
    deleteShoppingItem,
    clearCheckedShoppingItems,
    addCustomShoppingItem,
    isLoaded,
  } = useFoodStore();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('pantry');

  useEffect(() => {
    if (isLoaded && shoppingList.length === 0) refreshShoppingList();
  }, [isLoaded, shoppingList.length, refreshShoppingList]);

  const groupedItems = useMemo(
    () =>
      CATEGORIES.map((group) => ({
        category: group,
        items: shoppingList.filter((item) => item.category === group),
      })).filter((group) => group.items.length > 0),
    [shoppingList]
  );

  const completed = shoppingList.filter((item) => item.isChecked).length;

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    addCustomShoppingItem(name, category);
    setName('');
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="container-editorial w-full max-w-5xl flex-1 py-8 sm:py-12 md:py-20 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-semibold text-[#8A9B84] block">
              PLAN-BASED SHOPPING
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#171714] font-normal">
              Shopping List
            </h1>
            <p className="text-sm text-[#6E6A61]">
              {shoppingList.length === 0
                ? 'Generate from your planned meals or add items manually.'
                : `${completed} of ${shoppingList.length} items collected.`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="md" onClick={refreshShoppingList} className="gap-2 flex-1 sm:flex-none">
              <RefreshCw className="w-4 h-4" /> Refresh list
            </Button>
            {completed > 0 && (
              <Button variant="ghost" size="md" onClick={clearCheckedShoppingItems}>
                Clear collected
              </Button>
            )}
          </div>
        </div>

        {/* Add form */}
        <form onSubmit={handleAdd} className="bg-white border border-[#DCD5C9] p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-[1fr_10rem_auto] gap-3 rounded-[2px]">
          <label className="sr-only" htmlFor="shopping-item">Add an item</label>
          <input
            id="shopping-item"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Add something you need"
            className="min-h-11 w-full border border-[#DCD5C9] bg-[#F7F3EC] px-3 text-sm rounded-[2px] focus:outline-none focus:border-[#8A9B84]"
          />
          <div className="grid grid-cols-[1fr_auto] sm:grid-cols-none gap-3">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as FoodCategory)}
              className="min-h-11 border border-[#DCD5C9] bg-white px-3 text-sm rounded-[2px] focus:outline-none focus:border-[#8A9B84]"
            >
              {CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {CATEGORY_LABELS[value]}
                </option>
              ))}
            </select>
            <Button type="submit" variant="primary" size="md" className="gap-2">
              <Plus className="w-4 h-4" /> Add item
            </Button>
          </div>
        </form>

        {/* Shopping list or empty state */}
        {groupedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {groupedItems.map(({ category: group, items }) => (
              <section key={group} className="bg-white border border-[#DCD5C9] p-4 sm:p-6 rounded-[2px] space-y-3">
                <h2 className="text-xs uppercase tracking-widest font-sans font-semibold text-[#171714] border-b border-[#DCD5C9] pb-3">
                  {CATEGORY_LABELS[group]}
                </h2>
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item.id} className="group flex items-center gap-3 py-2">
                      <button
                        type="button"
                        onClick={() => toggleShoppingItem(item.id)}
                        aria-label={`Mark ${item.name} as ${item.isChecked ? 'not collected' : 'collected'}`}
                        className={`grid size-6 shrink-0 place-items-center border rounded-[2px] cursor-pointer transition-colors ${
                          item.isChecked
                            ? 'bg-[#8A9B84] border-[#8A9B84] text-white'
                            : 'border-[#DCD5C9] bg-[#F7F3EC] hover:border-[#8A9B84]/50'
                        }`}
                      >
                        {item.isChecked && <Check className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleShoppingItem(item.id)}
                        className={`min-w-0 flex-1 text-left text-sm cursor-pointer ${
                          item.isChecked ? 'text-[#6E6A61] line-through' : 'text-[#171714]'
                        }`}
                      >
                        {item.name}
                        {item.sourceMealCount && item.sourceMealCount > 1 && (
                          <span className="ml-2 text-[10px] text-[#6E6A61]">x{item.sourceMealCount}</span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteShoppingItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="p-2 text-[#6E6A61] sm:opacity-0 sm:group-hover:opacity-100 hover:text-[#B76546] transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <div className="p-12 bg-white border border-[#DCD5C9] rounded-[2px] text-center space-y-4">
            <ShoppingBag className="w-10 h-10 text-[#DCD5C9] mx-auto" />
            <h2 className="font-serif text-2xl text-[#171714]">Your shopping list is empty.</h2>
            <p className="text-sm text-[#6E6A61] max-w-sm mx-auto">
              Generate a daily plan first, then refresh to build your shopping list from planned meals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button variant="primary" size="md" onClick={refreshShoppingList} className="gap-2">
                <RefreshCw className="w-4 h-4" /> Build My List
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
