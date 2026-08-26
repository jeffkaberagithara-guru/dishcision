'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, RefreshCw, XCircle, Ban, Zap, Clock, Info } from 'lucide-react';
import { DecisionResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MealResultCardProps {
  decision: DecisionResult;
  onCookThis: (hadLeftovers: boolean) => void;
  onDishcisionAgain: () => void;
  onNotToday: () => void;
  onNotAvailable: () => void;
  onToggleKeepItEasy: () => void;
  isKeepItEasyActive: boolean;
  isLoading?: boolean;
}

export const MealResultCard: React.FC<MealResultCardProps> = ({
  decision,
  onCookThis,
  onDishcisionAgain,
  onNotToday,
  onNotAvailable,
  onToggleKeepItEasy,
  isKeepItEasyActive,
  isLoading = false,
}) => {
  const { meal, isFallback, fallbackReason, matchedIngredientsCount, totalIngredientsCount } =
    decision;

  const [hadLeftovers, setHadLeftovers] = useState(true);
  const [isAccepted, setIsAccepted] = useState(false);

  const handleCook = () => {
    setIsAccepted(true);
    onCookThis(hadLeftovers);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full bg-white border border-[#DCD5C9] rounded-[2px] overflow-hidden"
    >
      {/* Top bar */}
      <div className="p-4 sm:p-6 border-b border-[#DCD5C9]/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {isFallback ? (
            <Badge variant="terracotta">PANTRY STANDBY</Badge>
          ) : (
            <Badge variant="sage">RECOMMENDED</Badge>
          )}
          {meal.isQuick && <Badge variant="secondary">QUICK</Badge>}
        </div>

        <div className="flex items-center gap-3 text-xs font-sans text-[#6E6A61]">
          {meal.cookingTimeMinutes && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              ~{meal.cookingTimeMinutes}m
            </span>
          )}
          <span>
            {matchedIngredientsCount}/{totalIngredientsCount} available
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-5">
        <div className="space-y-1">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#171714] font-normal leading-tight">
            {meal.name}
          </h2>
          {meal.description && (
            <p className="text-sm text-[#6E6A61] font-sans leading-relaxed">
              {meal.description}
            </p>
          )}
        </div>

        {isFallback && (
          <div className="p-3 bg-[#EDE7DE]/50 border border-[#DCD5C9] rounded-[2px] flex items-start gap-2">
            <Info className="w-4 h-4 text-[#B76546] shrink-0 mt-0.5" />
            <p className="text-xs text-[#171714] leading-relaxed">
              <span className="font-semibold">We worked with what you have.</span>{' '}
              {fallbackReason || 'Built a balanced plate from available ingredients.'}
            </p>
          </div>
        )}

        {/* Plate breakdown */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-[#6E6A61] font-sans font-semibold">
            ON THE PLATE
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {meal.plate.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <span className="text-[#DCD5C9] text-sm select-none">+</span>
                )}
                <span className="inline-flex items-baseline gap-1.5">
                  <span className="font-serif text-base text-[#171714] font-medium">
                    {item.name}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-[#8A9B84] font-sans font-semibold">
                    {item.role}
                  </span>
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Leftovers checkbox */}
        <label className="flex items-center gap-2 text-xs font-sans text-[#6E6A61] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hadLeftovers}
            onChange={(e) => setHadLeftovers(e.target.checked)}
            className="w-4 h-4 rounded-[2px] accent-[#8A9B84] cursor-pointer"
          />
          <span>Plan leftovers for tomorrow morning</span>
        </label>
      </div>

      {/* Actions */}
      <div className="p-4 sm:p-6 border-t border-[#DCD5C9] bg-[#F7F3EC]/40 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button
            variant="primary"
            size="lg"
            onClick={handleCook}
            disabled={isAccepted}
            className="flex-1 gap-2"
          >
            <Check className="w-4 h-4" />
            <span className="hidden sm:inline">{isAccepted ? 'LOGGED — ENJOY' : 'I WILL COOK THIS'}</span>
            <span className="sm:hidden">{isAccepted ? 'LOGGED' : 'COOK THIS'}</span>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={onDishcisionAgain}
            isLoading={isLoading}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">DISHCISION AGAIN</span>
            <span className="sm:hidden">AGAIN</span>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onNotToday}
            className="px-3 py-1.5 border border-[#DCD5C9] bg-white text-[#6E6A61] hover:text-[#171714] rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Not Today</span>
          </button>

          <button
            onClick={onNotAvailable}
            className="px-3 py-1.5 border border-[#DCD5C9] bg-white text-[#6E6A61] hover:text-[#B76546] rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <Ban className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Don&apos;t Have Ingredients</span>
            <span className="sm:hidden">Missing</span>
          </button>

          <button
            onClick={onToggleKeepItEasy}
            className={`px-3 py-1.5 rounded-[2px] border transition-colors flex items-center gap-1.5 cursor-pointer text-xs ml-auto ${
              isKeepItEasyActive
                ? 'bg-[#8A9B84]/20 border-[#8A9B84] text-[#54684E] font-semibold'
                : 'bg-white border-[#DCD5C9] text-[#6E6A61] hover:text-[#171714]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isKeepItEasyActive ? 'Easy: ON' : 'Keep It Easy'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MealResultCard;
