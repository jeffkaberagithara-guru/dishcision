'use client';

import React, { useState } from 'react';
import { Meal, MealType, PlateComponent, PlateRole, FoodCategory } from '@/lib/types';
import { useFoodStore } from '@/lib/store/use-food-store';
import { FOOD_PARENTS } from '@/lib/data/food-taxonomy';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (meal: Omit<Meal, 'id'>) => void;
}

const ROLES: PlateRole[] = ['STAPLE', 'PROTEIN', 'LEGUME', 'VEGETABLE', 'SALAD', 'FRUIT', 'BEVERAGE'];

const ROLE_CATEGORY_MAP: Record<PlateRole, FoodCategory[]> = {
  STAPLE: ['staple'],
  PROTEIN: ['protein'],
  LEGUME: ['legume'],
  VEGETABLE: ['vegetable'],
  SALAD: ['salad'],
  FRUIT: ['fruit'],
  BEVERAGE: ['beverage'],
  OTHER: ['pantry'],
};

export const AddMealModal: React.FC<AddMealModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const { foodItems } = useFoodStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mealType, setMealType] = useState<MealType>('dinner');
  const [isQuick, setIsQuick] = useState(false);
  const [cookingTime, setCookingTime] = useState<number>(30);
  const [plate, setPlate] = useState<PlateComponent[]>([
    { role: 'STAPLE', name: 'Ugali' },
    { role: 'PROTEIN', name: 'Beef Stew' },
    { role: 'VEGETABLE', name: 'Sukuma Wiki' },
  ]);

  const getFoodLabel = (item: { name: string; parentId?: string }) => {
    if (item.parentId) {
      const parent = FOOD_PARENTS.find((p) => p.id === item.parentId);
      return parent ? `${parent.name}: ${item.name}` : item.name;
    }
    return item.name;
  };

  const handleAddComponent = () => {
    setPlate((prev) => [...prev, { role: 'VEGETABLE', name: '' }]);
  };

  const handleUpdateComponent = (index: number, updates: Partial<PlateComponent>) => {
    setPlate((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };

  const handleRemoveComponent = (index: number) => {
    if (plate.length <= 1) return;
    setPlate((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFoodSelect = (index: number, foodItemId: string) => {
    if (!foodItemId) {
      handleUpdateComponent(index, { foodItemId: undefined, name: '' });
      return;
    }
    const food = foodItems.find((f) => f.id === foodItemId);
    if (food) {
      handleUpdateComponent(index, { foodItemId: food.id, name: food.name });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validPlate = plate.filter((p) => p.name.trim().length > 0);
    if (!name.trim() || validPlate.length === 0) return;

    onAdd({
      name: name.trim(),
      description: description.trim() || undefined,
      mealType,
      isQuick,
      cookingTimeMinutes: Number(cookingTime) || 30,
      plate: validPlate,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop',
    });

    setName('');
    setDescription('');
    setMealType('dinner');
    setIsQuick(false);
    setCookingTime(30);
    setPlate([
      { role: 'STAPLE', name: 'Ugali' },
      { role: 'PROTEIN', name: 'Beef Stew' },
      { role: 'VEGETABLE', name: 'Sukuma Wiki' },
    ]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Custom Meal" className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#6E6A61] mb-1 font-sans font-medium">
            Meal Title
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ndengu Mukimo + Beef Stew + Cabbage"
            className="w-full min-h-11 px-3 border border-[#DCD5C9] bg-white text-sm text-[#171714] rounded-[2px] focus:outline-none focus:border-[#8A9B84]"
            required
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#6E6A61] mb-1 font-sans font-medium">
              Meal Category
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value as MealType)}
              className="w-full min-h-11 px-3 border border-[#DCD5C9] bg-white text-sm text-[#171714] rounded-[2px] focus:outline-none focus:border-[#8A9B84]"
            >
              <option value="dinner">Dinner</option>
              <option value="lunch">Lunch</option>
              <option value="breakfast">Breakfast</option>
              <option value="any">Any Meal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#6E6A61] mb-1 font-sans font-medium">
              Est. Cooking Time (Minutes)
            </label>
            <input
              type="number"
              value={cookingTime}
              onChange={(e) => setCookingTime(Number(e.target.value))}
              min="5"
              max="180"
              className="w-full min-h-11 px-3 border border-[#DCD5C9] bg-white text-sm text-[#171714] rounded-[2px] focus:outline-none focus:border-[#8A9B84]"
            />
          </div>
        </div>

        {/* Plate Components Builder */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#171714] font-semibold">
              Plate Components
            </span>
            <button
              type="button"
              onClick={handleAddComponent}
              className="text-xs text-[#8A9B84] hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Component
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {plate.map((comp, idx) => {
              const allowedCategories = ROLE_CATEGORY_MAP[comp.role] || [];
              const availableFoods = foodItems.filter((f) => allowedCategories.includes(f.category));

              return (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={comp.role}
                    onChange={(e) =>
                      handleUpdateComponent(idx, { role: e.target.value as PlateRole })
                    }
                    className="w-28 min-h-11 px-2 border border-[#DCD5C9] bg-white text-xs text-[#171714] rounded-[2px] focus:outline-none focus:border-[#8A9B84]"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>

                  {availableFoods.length > 0 ? (
                    <select
                      value={comp.foodItemId || ''}
                      onChange={(e) => handleFoodSelect(idx, e.target.value)}
                      className="flex-1 min-h-11 px-2 border border-[#DCD5C9] bg-white text-xs text-[#171714] rounded-[2px] focus:outline-none focus:border-[#8A9B84]"
                    >
                      <option value="">Custom name...</option>
                      {availableFoods.map((f) => (
                        <option key={f.id} value={f.id}>
                          {getFoodLabel(f)}
                        </option>
                      ))}
                    </select>
                  ) : null}

                  {!comp.foodItemId && (
                    <input
                      type="text"
                      value={comp.name}
                      onChange={(e) => handleUpdateComponent(idx, { name: e.target.value })}
                      placeholder="Component name (e.g. Ugali)"
                      className="flex-1 min-h-11 px-3 border border-[#DCD5C9] bg-white text-xs text-[#171714] rounded-[2px] focus:outline-none focus:border-[#8A9B84]"
                      required
                    />
                  )}

                  {plate.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveComponent(idx)}
                      className="p-1.5 text-[#6E6A61] hover:text-[#B76546] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 text-xs font-sans text-[#171714] cursor-pointer">
            <input
              type="checkbox"
              checked={isQuick}
              onChange={(e) => setIsQuick(e.target.checked)}
              className="w-4 h-4 rounded-[2px] accent-[#8A9B84]"
            />
            <span>Mark as quick meal for &quot;Keep It Easy&quot; filter</span>
          </label>
        </div>

        <div className="pt-4 border-t border-[#DCD5C9] flex justify-end gap-2">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            Save Meal
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMealModal;
