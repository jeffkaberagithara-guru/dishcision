'use client';

import React, { useState, useMemo } from 'react';
import { FoodCategory, FoodItem } from '@/lib/types';
import { FOOD_PARENTS } from '@/lib/data/food-taxonomy';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

interface AddFoodItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<FoodItem, 'id' | 'source'>) => void;
}

const CATEGORIES: { label: string; value: FoodCategory }[] = [
  { label: 'Staple (e.g. Ugali, Rice, Potatoes, Nduma)', value: 'staple' },
  { label: 'Protein (e.g. Beef, Eggs, Pork, Sausages)', value: 'protein' },
  { label: 'Vegetable (e.g. Sukuma Wiki, Cabbage, Spinach)', value: 'vegetable' },
  { label: 'Legume (e.g. Ndengu, Yellow Beans, Peas)', value: 'legume' },
  { label: 'Salad (e.g. Kachumbari, Coleslaw)', value: 'salad' },
  { label: 'Fruit (e.g. Avocado, Banana)', value: 'fruit' },
  { label: 'Beverage (e.g. Spiced Chai, Coffee, Milk)', value: 'beverage' },
  { label: 'Pantry / Seasoning (e.g. Oil, Spices)', value: 'pantry' },
];

export const AddFoodItemModal: React.FC<AddFoodItemModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('staple');
  const [inStock, setInStock] = useState(true);
  const [parentId, setParentId] = useState('');

  const filteredParents = useMemo(() => {
    return FOOD_PARENTS.filter((p) => p.category === category);
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      category,
      inStock,
      parentId: parentId || undefined,
    });

    setName('');
    setCategory('staple');
    setInStock(true);
    setParentId('');
    onClose();
  };

  const handleCategoryChange = (newCat: FoodCategory) => {
    setCategory(newCat);
    // Reset parent if category changes and current parent doesn't match
    const matchingParents = FOOD_PARENTS.filter((p) => p.category === newCat);
    if (parentId && !matchingParents.some((p) => p.id === parentId)) {
      setParentId('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Food Item" className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#6E6A61] mb-1 font-sans font-medium">
            Item Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ndengu Mukimo, Beef Stew Meat, Sukuma Wiki"
            className="w-full min-h-11 px-3 border border-[#DCD5C9] bg-white text-sm text-[#171714] rounded-[2px] focus:outline-none focus:border-[#8A9B84]"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#6E6A61] mb-1 font-sans font-medium">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value as FoodCategory)}
            className="w-full min-h-11 px-3 border border-[#DCD5C9] bg-white text-sm text-[#171714] rounded-[2px] focus:outline-none focus:border-[#8A9B84]"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {filteredParents.length > 0 && (
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#6E6A61] mb-1 font-sans font-medium">
              Group As Variant Of <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full min-h-11 px-3 border border-[#DCD5C9] bg-white text-sm text-[#171714] rounded-[2px] focus:outline-none focus:border-[#8A9B84]"
            >
              <option value="">Standalone (no variant group)</option>
              {filteredParents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.description ? `— ${p.description}` : ''}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-[#6E6A61] mt-1 font-sans">
              Link to a parent food to group variants together in your library.
            </p>
          </div>
        )}

        <div className="space-y-2 pt-2">
          <label className="flex items-center gap-2 text-xs font-sans text-[#171714] cursor-pointer">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-4 h-4 rounded-[2px] accent-[#8A9B84]"
            />
            <span>Currently in stock in the kitchen</span>
          </label>
        </div>

        <div className="pt-4 border-t border-[#DCD5C9] flex justify-end gap-2">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            Save Item
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddFoodItemModal;
