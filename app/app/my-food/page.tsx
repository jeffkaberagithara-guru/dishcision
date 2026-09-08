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
import { FoodItem, Meal } from '@/lib/types';
import {
  Plus, Search, Trash2, Star, Ban, Utensils, Package, Check, X, Lock, Edit3,
} from 'lucide-react';

type TabKey = 'foods' | 'meals';

export default function MyFoodPage() {
  const {
    foodItems, meals, addItem, deleteItem, toggleInStock,
    addMeal, updateMeal, deleteMeal, toggleMealFavorite, toggleMealExclusion, isLoaded,
  } = useFoodStore();

  const [activeTab, setActiveTab] = useState<TabKey>('foods');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [editingMealName, setEditingMealName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'food' | 'meal'>('food');

  const filteredMeals = useMemo(() => {
    if (!searchQuery.trim()) return meals;
    const q = searchQuery.toLowerCase();
    return meals.filter((m) =>
      m.name.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q) ||
      m.plate.some((p) => p.name.toLowerCase().includes(q))
    );
  }, [meals, searchQuery]);

  const filteredFoodItems = useMemo(() => {
    if (!searchQuery.trim()) return foodItems;
    const q = searchQuery.toLowerCase();
    return foodItems.filter((f) => f.name.toLowerCase().includes(q));
  }, [foodItems, searchQuery]);

  const defaultFoods = useMemo(() => filteredFoodItems.filter((f) => f.source === 'default'), [filteredFoodItems]);
  const personalFoods = useMemo(() => filteredFoodItems.filter((f) => f.source === 'personal'), [filteredFoodItems]);
  const defaultMeals = useMemo(() => filteredMeals.filter((m) => m.source === 'default'), [filteredMeals]);
  const personalMeals = useMemo(() => filteredMeals.filter((m) => m.source === 'personal'), [filteredMeals]);

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    if (deleteType === 'food') deleteItem(deleteConfirmId);
    else deleteMeal(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  const handleStartEditMeal = (meal: Meal) => { setEditingMealId(meal.id); setEditingMealName(meal.name); };
  const handleSaveEditMeal = (id: string) => {
    if (editingMealName.trim()) updateMeal(id, { name: editingMealName.trim() });
    setEditingMealId(null);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] flex flex-col justify-between">
        <Header />
        <main className="container-editorial py-32 text-center">
          <p className="font-serif italic text-2xl text-[#6E6A61]">Loading your pantry...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col pb-24 lg:pb-0">
      <Header />
      <main className="container-editorial w-full max-w-5xl flex-1 py-10 sm:py-14 md:py-20 space-y-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8A9B84] block">Your food library</span>
            <h1 className="font-hero text-3xl sm:text-5xl text-[#171714]">Your Food</h1>
            <p className="font-serif italic text-lg text-[#6E6A61]">Everything you already know how to cook.</p>
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

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E6A61]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search meals and ingredients..."
            className="w-full pl-12 pr-11 min-h-14 rounded-2xl border border-[#DCD5C9] bg-white text-base focus:outline-none focus:border-[#8A9B84] focus:ring-4 focus:ring-[#8A9B84]/10"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6E6A61] hover:text-[#171714] p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 border-b border-[#DCD5C9] overflow-x-auto">
          {([
            { key: 'foods' as TabKey, label: 'Foods', count: foodItems.length },
            { key: 'meals' as TabKey, label: 'Meals', count: meals.length },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap cursor-pointer ${
                activeTab === tab.key ? 'text-[#171714] border-[#171714]' : 'text-[#6E6A61] border-transparent hover:text-[#171714]'
              }`}
            >
              {tab.label} <span className="text-[#8A9B84]">({tab.count})</span>
            </button>
          ))}
        </div>

        {activeTab === 'foods' && (
          <div className="space-y-8">
            <div className="p-4 card-modern flex items-center gap-3">
              <Check className="w-5 h-5 text-[#8A9B84] shrink-0" />
              <p className="text-sm text-[#6E6A61] font-sans">
                Toggle the checkbox on each food to mark what&apos;s in stock. Unchecked items won&apos;t appear in your DISHCISION.
              </p>
            </div>
            {filteredFoodItems.length === 0 ? (
              <div className="card-modern p-12 text-center space-y-4">
                <div className="grid place-items-center size-16 rounded-2xl bg-[#8A9B84]/12 text-[#54684E] mx-auto">
                  <Package className="w-8 h-8" />
                </div>
                <h2 className="font-hero text-2xl text-[#171714]">{searchQuery ? 'No foods match.' : 'Your food library is empty.'}</h2>
                <p className="text-sm text-[#6E6A61]">{searchQuery ? 'Try a different search.' : 'Add the foods you know how to cook.'}</p>
                {!searchQuery && <Button variant="primary" size="md" onClick={() => setIsAddFoodOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> Add Food</Button>}
              </div>
            ) : (
              <>
                {defaultFoods.length > 0 && (
                  <FoodSection
                    items={defaultFoods}
                    label="Dishcision Foods"
                    locked
                    onToggleStock={toggleInStock}
                    onDelete={null}
                  />
                )}
                {personalFoods.length > 0 && <div className="border-t border-[#DCD5C9] pt-6" />}
                {personalFoods.length > 0 && (
                  <FoodSection
                    items={personalFoods}
                    label="My Foods"
                    locked={false}
                    onToggleStock={toggleInStock}
                    onDelete={(id) => { setDeleteConfirmId(id); setDeleteType('food'); }}
                  />
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'meals' && (
          <div className="space-y-8">
            {filteredMeals.length === 0 ? (
              <div className="card-modern p-12 text-center space-y-4">
                <div className="grid place-items-center size-16 rounded-2xl bg-[#8A9B84]/12 text-[#54684E] mx-auto">
                  <Utensils className="w-8 h-8" />
                </div>
                <h2 className="font-hero text-2xl text-[#171714]">{searchQuery ? 'No meals match.' : 'Your meal library is empty.'}</h2>
                <p className="text-sm text-[#6E6A61]">{searchQuery ? 'Try a different search.' : 'Add the meals you know how to cook.'}</p>
                {!searchQuery && <Button variant="primary" size="md" onClick={() => setIsAddMealOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> Add Meal</Button>}
              </div>
            ) : (
              <>
                {defaultMeals.length > 0 && (
                  <MealSection
                    items={defaultMeals}
                    label="Dishcision Meals"
                    locked
                    editingMealId={editingMealId}
                    editingMealName={editingMealName}
                    onEditNameChange={setEditingMealName}
                    onStartEdit={handleStartEditMeal}
                    onSaveEdit={handleSaveEditMeal}
                    onCancelEdit={() => setEditingMealId(null)}
                    onToggleFavorite={toggleMealFavorite}
                    onToggleExclusion={toggleMealExclusion}
                    onDelete={null}
                  />
                )}
                {personalMeals.length > 0 && <div className="border-t border-[#DCD5C9] pt-6" />}
                {personalMeals.length > 0 && (
                  <MealSection
                    items={personalMeals}
                    label="My Meals"
                    locked={false}
                    editingMealId={editingMealId}
                    editingMealName={editingMealName}
                    onEditNameChange={setEditingMealName}
                    onStartEdit={handleStartEditMeal}
                    onSaveEdit={handleSaveEditMeal}
                    onCancelEdit={() => setEditingMealId(null)}
                    onToggleFavorite={toggleMealFavorite}
                    onToggleExclusion={toggleMealExclusion}
                    onDelete={(id) => { setDeleteConfirmId(id); setDeleteType('meal'); }}
                  />
                )}
              </>
            )}
          </div>
        )}
      </main>

      <AddFoodItemModal isOpen={isAddFoodOpen} onClose={() => setIsAddFoodOpen(false)} onAdd={addItem} />
      <AddMealModal isOpen={isAddMealOpen} onClose={() => setIsAddMealOpen(false)} onAdd={addMeal} />

      <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Confirm deletion">
        <div className="space-y-4">
          <p className="text-sm text-[#6E6A61]">Are you sure you want to delete this {deleteType}? This cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="md" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button variant="danger" size="md" onClick={handleDeleteConfirm}>Delete</Button>
          </div>
        </div>
      </Modal>

      <Footer />
      <BottomNav />
    </div>
  );
}

/* -------------------- Food section -------------------- */

function FoodSection({
  items,
  label,
  locked,
  onToggleStock,
  onDelete,
}: {
  items: FoodItem[];
  label: string;
  locked: boolean;
  onToggleStock: (id: string) => void;
  onDelete: ((id: string) => void) | null;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#6E6A61]">{label}</span>
        <Badge variant="muted" size="sm">{items.length}</Badge>
        {locked && <Lock className="w-3.5 h-3.5 text-[#DCD5C9]" />}
      </div>
      <div className="card-modern divide-y divide-[#DCD5C9]/50 overflow-hidden">
        {items.map((item) => (
          <div key={item.id} className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-[#F7F3EC]/40 transition-colors">
            <button
              onClick={() => onToggleStock(item.id)}
              className={`grid size-7 shrink-0 place-items-center rounded-lg border transition-colors cursor-pointer ${
                item.inStock ? 'bg-[#8A9B84] border-[#8A9B84] text-white' : 'border-[#DCD5C9] bg-white hover:border-[#8A9B84]/50'
              }`}
              title={item.inStock ? 'Mark out of stock' : 'Mark in stock'}
            >
              {item.inStock && <Check className="w-4 h-4" />}
            </button>
            <span className={`flex-1 min-w-0 text-base font-medium ${item.inStock ? 'text-[#171714]' : 'text-[#6E6A61] line-through'}`}>
              {item.name}
            </span>
            {onDelete && (
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 text-[#6E6A61] hover:text-[#B76546] rounded-lg transition-colors cursor-pointer"
                title="Delete item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------- Meal section -------------------- */

function MealSection({
  items,
  label,
  locked,
  editingMealId,
  editingMealName,
  onEditNameChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onToggleFavorite,
  onToggleExclusion,
  onDelete,
}: {
  items: Meal[];
  label: string;
  locked: boolean;
  editingMealId: string | null;
  editingMealName: string;
  onEditNameChange: (v: string) => void;
  onStartEdit: (m: Meal) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
  onToggleFavorite: (id: string) => void;
  onToggleExclusion: (id: string) => void;
  onDelete: ((id: string) => void) | null;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#6E6A61]">{label}</span>
        <Badge variant="muted" size="sm">{items.length}</Badge>
        {locked && <Lock className="w-3.5 h-3.5 text-[#DCD5C9]" />}
      </div>
      <div className="space-y-3">
        {items.map((meal) => (
          <div key={meal.id} className="card-modern p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {meal.mealType && meal.mealType !== 'any' && <Badge variant="muted" size="sm">{meal.mealType}</Badge>}
                  {meal.isQuick && <Badge variant="sage" size="sm">QUICK</Badge>}
                  {meal.isFavorite && <Star className="w-4 h-4 text-[#B76546] fill-[#B76546]" />}
                  {meal.isExcluded && <Badge variant="terracotta" size="sm">NEVER</Badge>}
                </div>
                {editingMealId === meal.id ? (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={editingMealName}
                      onChange={(e) => onEditNameChange(e.target.value)}
                      className="flex-1 px-3 py-2 border border-[#8A9B84] bg-white text-base rounded-xl min-h-11"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === 'Enter') onSaveEdit(meal.id); if (e.key === 'Escape') onCancelEdit(); }}
                    />
                    <button onClick={() => onSaveEdit(meal.id)} className="p-2 text-[#8A9B84] hover:text-[#54684E] cursor-pointer"><Check className="w-5 h-5" /></button>
                    <button onClick={onCancelEdit} className="p-2 text-[#6E6A61] hover:text-[#171714] cursor-pointer"><X className="w-5 h-5" /></button>
                  </div>
                ) : (
                  <h3 className="font-serif text-xl font-medium text-[#171714] truncate pt-0.5">{meal.name}</h3>
                )}
                {meal.description && <p className="text-sm text-[#6E6A61] line-clamp-2">{meal.description}</p>}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {meal.plate.map((p, i) => (
                <span key={i} className="text-xs font-medium px-3 py-1 bg-[#F7F3EC] border border-[#DCD5C9] text-[#171714] rounded-full">
                  {p.name}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 pt-1 border-t border-[#DCD5C9]/50">
              <IconButton onClick={() => onToggleFavorite(meal.id)} active={false} activeClass="text-[#B76546]" title={meal.isFavorite ? 'Remove favorite' : 'Mark as favorite'}>
                <Star className={`w-4 h-4 ${meal.isFavorite ? 'fill-current text-[#B76546]' : ''}`} />
              </IconButton>
              <IconButton onClick={() => onToggleExclusion(meal.id)} active={meal.isExcluded ?? false} activeClass="text-[#B76546]" title={meal.isExcluded ? 'Allow this meal' : 'Never recommend this'}>
                <Ban className="w-4 h-4" />
              </IconButton>
              <IconButton onClick={() => onStartEdit(meal)} active={false} activeClass="" title="Rename">
                <Edit3 className="w-4 h-4" />
              </IconButton>
              {onDelete && (
                <IconButton onClick={() => onDelete(meal.id)} active={false} activeClass="text-[#B76546]" title="Delete" className="ml-auto hover:text-[#B76546]">
                  <Trash2 className="w-4 h-4" />
                </IconButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IconButton({
  onClick,
  active,
  activeClass,
  title,
  children,
  className,
}: {
  onClick: () => void;
  active: boolean;
  activeClass: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-xl transition-colors cursor-pointer ${active ? activeClass : 'text-[#6E6A61] hover:text-[#171714]'} ${className ?? ''}`}
    >
      {children}
    </button>
  );
}
