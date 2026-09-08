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
  staple: 'Staples',
  protein: 'Proteins',
  vegetable: 'Vegetables',
  legume: 'Legumes',
  salad: 'Salads',
  fruit: 'Fruit',
  beverage: 'Beverages',
  pantry: 'Pantry',
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
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col pb-24 lg:pb-0">
      <Header />
      <main className="container-editorial w-full max-w-5xl flex-1 py-10 sm:py-14 md:py-20 space-y-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8A9B84] block">
              Plan-based list
            </span>
            <h1 className="font-hero text-3xl sm:text-5xl text-[#171714]">Shopping List</h1>
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

        <form onSubmit={handleAdd} className="card-modern p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-[1fr_10rem_auto] gap-3">
          <label className="sr-only" htmlFor="shopping-item">Add an item</label>
          <input
            id="shopping-item"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Add something you need"
            className="min-h-12 w-full border border-[#DCD5C9] bg-[#F7F3EC] px-4 text-base rounded-xl focus:outline-none focus:border-[#8A9B84] focus:ring-4 focus:ring-[#8A9B84]/10"
          />
          <div className="grid grid-cols-[1fr_auto] sm:grid-cols-none gap-3">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as FoodCategory)}
              className="min-h-12 border border-[#DCD5C9] bg-white px-3 text-base rounded-xl focus:outline-none focus:border-[#8A9B84]"
            >
              {CATEGORIES.map((value) => (
                <option key={value} value={value}>{CATEGORY_LABELS[value]}</option>
              ))}
            </select>
            <Button type="submit" variant="primary" size="md" className="gap-2">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
        </form>

        {groupedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {groupedItems.map(({ category: group, items }) => (
              <section key={group} className="card-modern p-5 sm:p-6 space-y-3">
                <h2 className="font-serif text-xl font-semibold text-[#171714] border-b border-[#DCD5C9]/60 pb-3">
                  {CATEGORY_LABELS[group]}
                </h2>
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item.id} className="group flex items-center gap-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => toggleShoppingItem(item.id)}
                        aria-label={`Mark ${item.name} as ${item.isChecked ? 'not collected' : 'collected'}`}
                        className={`grid size-7 shrink-0 place-items-center rounded-lg border cursor-pointer transition-colors ${
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
                        className={`min-w-0 flex-1 text-left text-base font-medium cursor-pointer ${
                          item.isChecked ? 'text-[#6E6A61] line-through' : 'text-[#171714]'
                        }`}
                      >
                        {item.name}
                        {item.sourceMealCount && item.sourceMealCount > 1 && (
                          <span className="ml-2 text-xs text-[#6E6A61]">x{item.sourceMealCount}</span>
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
          <div className="card-modern p-12 text-center space-y-5">
            <div className="grid place-items-center size-16 rounded-2xl bg-[#8A9B84]/12 text-[#54684E] mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-hero text-2xl text-[#171714]">Your shopping list is empty.</h2>
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
