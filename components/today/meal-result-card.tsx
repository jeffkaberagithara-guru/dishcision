'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
      className="w-full bg-white border border-[#DCD5C9] rounded-[2px] overflow-hidden shadow-xs"
    >
      {/* Header Banner */}
      <div className="p-4 sm:p-6 md:p-8 border-b border-[#DCD5C9]/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {isFallback ? (
            <Badge variant="terracotta">PANTRY STANDBY</Badge>
          ) : (
            <Badge variant="sage">RECOMMENDED DISHCISION</Badge>
          )}
          {meal.isQuick && <Badge variant="secondary">QUICK & EASY</Badge>}
        </div>

        <div className="flex items-center gap-4 text-xs font-sans text-[#6E6A61]">
          {meal.cookingTimeMinutes && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              ~{meal.cookingTimeMinutes} mins
            </span>
          )}
          <span>
            {matchedIngredientsCount}/{totalIngredientsCount} in stock
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#171714] font-normal leading-tight">
            {meal.name}
          </h2>
          {meal.description && (
            <p className="text-sm text-[#6E6A61] font-sans leading-relaxed">
              {meal.description}
            </p>
          )}
        </div>

        {/* Image — desktop only */}
        {meal.image && (
          <div className="hidden sm:block relative aspect-[4/3] w-full overflow-hidden rounded-[2px] border border-[#DCD5C9] bg-[#EDE7DE]">
            <Image
              src={
                meal.image ||
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop'
              }
              alt={meal.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 0vw, 40vw"
            />
          </div>
        )}

        {isFallback && (
          <div className="p-4 bg-[#EDE7DE]/50 border border-[#DCD5C9] rounded-[2px] flex items-start gap-3">
            <Info className="w-4 h-4 text-[#B76546] shrink-0 mt-0.5" />
            <div className="text-xs text-[#171714] leading-relaxed">
              <span className="font-semibold block mb-0.5">We worked with what you have.</span>
              {fallbackReason ||
                'Limited ingredients match this category. We generated an authentic baseline combination.'}
            </div>
          </div>
        )}

        {/* Plate Breakdown — Editorial Style */}
        <div className="space-y-3">
          <span className="text-[10px] uppercase tracking-widest text-[#171714] font-semibold block">
            ON THE PLATE
          </span>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            {meal.plate.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <span className="text-[#DCD5C9] text-sm font-serif select-none">+</span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-serif text-base sm:text-lg text-[#171714] font-medium">
                    {item.name}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-[#6E6A61] font-sans">
                    {item.role}
                  </span>
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Leftovers prompt */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs font-sans text-[#6E6A61] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hadLeftovers}
              onChange={(e) => setHadLeftovers(e.target.checked)}
              className="w-4 h-4 rounded-[2px] accent-[#8A9B84] cursor-pointer"
            />
            <span>Plan leftovers for tomorrow morning&apos;s breakfast</span>
          </label>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 sm:p-6 md:p-8 bg-[#F7F3EC]/50 border-t border-[#DCD5C9] space-y-4">
        {/* Primary Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            variant="primary"
            size="hero"
            onClick={handleCook}
            disabled={isAccepted}
            className="flex-1 gap-2"
          >
            <Check className="w-4 h-4" />
            <span className="hidden sm:inline">{isAccepted ? 'LOGGED TO HISTORY — ENJOY COOKING' : 'I WILL COOK THIS'}</span>
            <span className="sm:hidden">{isAccepted ? 'LOGGED!' : 'COOK THIS'}</span>
          </Button>

          <Button
            variant="secondary"
            size="hero"
            onClick={onDishcisionAgain}
            isLoading={isLoading}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">DISHCISION AGAIN</span>
            <span className="sm:hidden">AGAIN</span>
          </Button>
        </div>

        {/* Secondary Feedback Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-sans">
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
          </div>

          <button
            onClick={onToggleKeepItEasy}
            className={`px-3 py-1.5 rounded-[2px] border transition-colors flex items-center gap-1.5 cursor-pointer text-xs ${
              isKeepItEasyActive
                ? 'bg-[#8A9B84]/20 border-[#8A9B84] text-[#54684E] font-semibold'
                : 'bg-white border-[#DCD5C9] text-[#6E6A61] hover:text-[#171714]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isKeepItEasyActive ? 'Easy Mode: ON' : 'Keep It Easy'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MealResultCard;
