'use client';

import React, { useState } from 'react';
import { FoodItem } from '@/lib/types';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';

interface UseWhatIHaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  foodItems: FoodItem[];
  onDecideWithSelected: (selectedFoodIds: string[]) => void;
}

export const UseWhatIHaveModal: React.FC<UseWhatIHaveModalProps> = ({
  isOpen,
  onClose,
  foodItems,
  onDecideWithSelected,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    foodItems.filter((i) => i.inStock).map((i) => i.id)
  );

  const toggleItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(foodItems.map((i) => i.id));
  };

  const clearAll = () => {
    setSelectedIds([]);
  };

  const handleDecide = () => {
    onDecideWithSelected(selectedIds);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="What's in Your House Right Now?"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        <p className="text-xs text-[#6E6A61] font-sans leading-relaxed">
          Select what you have on hand. DISHCISION will compute the best balanced meal using strictly these ingredients.
        </p>

        <div className="flex items-center justify-between text-xs font-sans border-b border-[#DCD5C9] pb-2">
          <span className="text-[#171714] font-medium">
            {selectedIds.length} of {foodItems.length} items available
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={selectAll}
              className="text-[#8A9B84] hover:underline cursor-pointer font-medium"
            >
              Select All
            </button>
            <span className="text-[#DCD5C9]">·</span>
            <button
              onClick={clearAll}
              className="text-[#6E6A61] hover:underline cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="max-h-[50vh] overflow-y-auto space-y-4 pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {foodItems.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`p-2.5 rounded-[2px] border text-left flex items-start justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#8A9B84] text-[#171714] shadow-xs'
                      : 'bg-[#EDE7DE]/40 border-[#DCD5C9] text-[#6E6A61] hover:border-[#8A9B84]/50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-[#6E6A61] block">
                      {item.category}
                    </span>
                    <span className="font-serif text-sm font-medium block leading-tight">
                      {item.name}
                    </span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-[2px] border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-[#8A9B84] border-[#8A9B84] text-white'
                        : 'border-[#DCD5C9] bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-[#DCD5C9] flex justify-end gap-3">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleDecide} className="gap-2">
            <Sparkles className="w-4 h-4 text-[#8A9B84]" />
            Make Dishcision with Selected
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UseWhatIHaveModal;
