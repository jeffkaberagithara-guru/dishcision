'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Shuffle, Clock } from 'lucide-react';
import { DecisionResult } from '@/lib/types';

interface BigMealRevealProps {
  decision: DecisionResult;
  onCookThis: () => void;
  onAgain: () => void;
  isAccepted: boolean;
}

const ROLE_LABEL: Record<string, string> = {
  STAPLE: 'Staple',
  PROTEIN: 'Protein',
  LEGUME: 'Legume',
  VEGETABLE: 'Vegetable',
  SALAD: 'Salad',
  FRUIT: 'Fruit',
  BEVERAGE: 'Drink',
  OTHER: 'Side',
};

const ROLE_EMOJI: Record<string, string> = {
  STAPLE: '🍚',
  PROTEIN: '🍗',
  LEGUME: '🫘',
  VEGETABLE: '🥬',
  SALAD: '🥗',
  FRUIT: '🍌',
  BEVERAGE: '☕',
  OTHER: '🥄',
};

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  any: 'Any meal',
};

export const BigMealReveal: React.FC<BigMealRevealProps> = ({
  decision,
  onCookThis,
  onAgain,
  isAccepted,
}) => {
  const { meal } = decision;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full card-modern overflow-hidden"
    >
      <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.25em] font-sans font-semibold text-[#8A9B84]">
            A balanced {meal.mealType && MEAL_TYPE_LABELS[meal.mealType] ? MEAL_TYPE_LABELS[meal.mealType].toLowerCase() : 'meal'} for you
          </span>
          <h2 className="font-hero text-3xl sm:text-4xl md:text-5xl text-[#171714]">
            {meal.name}
          </h2>
          {meal.description && (
            <p className="text-base text-[#6E6A61] font-sans max-w-xl leading-relaxed">
              {meal.description}
            </p>
          )}
          {meal.cookingTimeMinutes && (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[#6E6A61] px-3 py-1.5 bg-[#F7F3EC] border border-[#DCD5C9] rounded-full">
              <Clock className="w-4 h-4" /> about {meal.cookingTimeMinutes} minutes
            </span>
          )}
        </div>
      </div>

      {/* Plate breakdown — big friendly chips */}
      <div className="px-6 sm:px-10 pb-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-stretch gap-3 sm:gap-4 justify-center">
          {meal.plate.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.08 }}
              className="flex-1 min-w-[9rem] flex flex-col items-center gap-2 rounded-2xl bg-[#F7F3EC] border border-[#DCD5C9]/70 p-5 text-center"
            >
              <span className="text-4xl">{ROLE_EMOJI[item.role] || '🥄'}</span>
              <span className="font-serif text-lg font-medium text-[#171714] leading-tight">
                {item.name}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8A9B84] font-sans font-semibold">
                {ROLE_LABEL[item.role] || item.role}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 sm:px-10 py-6 sm:py-8 space-y-3">
        <button
          onClick={onCookThis}
          disabled={isAccepted}
          className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-[#171714] text-[#F7F3EC] min-h-[4.25rem] text-lg font-semibold hover:bg-[#2A2925] disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.99] cursor-pointer"
        >
          <Check className="w-6 h-6 text-[#8A9B84]" />
          {isAccepted ? 'Great choice — enjoy!' : "I'll cook this"}
        </button>

        <button
          onClick={onAgain}
          className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-[#171714] text-[#171714] min-h-[4.25rem] text-lg font-semibold hover:bg-[#171714]/5 transition-all active:scale-[0.99] cursor-pointer"
        >
          <Shuffle className="w-6 h-6" />
          Surprise me again
        </button>
      </div>
    </motion.div>
  );
};

export default BigMealReveal;
