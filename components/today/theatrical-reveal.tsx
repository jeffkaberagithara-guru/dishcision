'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Utensils, CheckCircle2, Scale } from 'lucide-react';

interface TheatricalRevealProps {
  onComplete: () => void;
  durationMs?: number;
}

const STEPS = [
  { label: 'CHECKING YOUR FOOD...', icon: Utensils },
  { label: 'CHECKING RECENT MEALS...', icon: Sparkles },
  { label: 'BALANCING THE PLATE...', icon: Scale },
  { label: 'DISHCISION MADE.', icon: CheckCircle2 },
];

export const TheatricalReveal: React.FC<TheatricalRevealProps> = ({
  onComplete,
  durationMs = 1200,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const stepDuration = durationMs / STEPS.length;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 250);
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  const currentStep = STEPS[currentStepIndex];
  const Icon = currentStep.icon;

  return (
    <div className="w-full min-h-[280px] sm:min-h-[380px] bg-white border border-[#DCD5C9] rounded-[2px] p-6 sm:p-8 md:p-16 flex flex-col items-center justify-center space-y-6 sm:space-y-8 shadow-xs">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Subtle pulsating ring */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full border border-[#8A9B84]"
        />
        <Icon className="w-6 h-6 text-[#8A9B84]" />
      </div>

      <div className="text-center space-y-2 h-16 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="font-sans text-xs uppercase tracking-[0.25em] font-semibold text-[#171714]"
          >
            {currentStep.label}
          </motion.p>
        </AnimatePresence>
        <span className="text-[10px] uppercase tracking-widest text-[#6E6A61] font-sans">
          Step {currentStepIndex + 1} of {STEPS.length}
        </span>
      </div>

      {/* Progress line */}
      <div className="w-48 h-[2px] bg-[#EDE7DE] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.25 }}
          className="h-full bg-[#8A9B84]"
        />
      </div>
    </div>
  );
};

export default TheatricalReveal;
