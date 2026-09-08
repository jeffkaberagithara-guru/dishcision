'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Button } from '@/components/ui/button';
import { useFoodStore } from '@/lib/store/use-food-store';
import { RotateCcw, Info } from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, resetToStarterLibrary } = useFoodStore();
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col pb-24 lg:pb-0">
      <Header />
      <main className="container-editorial w-full max-w-3xl flex-1 py-10 sm:py-14 md:py-20 space-y-8">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8A9B84] block">Preferences</span>
          <h1 className="font-hero text-3xl sm:text-5xl text-[#171714]">Settings</h1>
        </div>

        <section className="card-modern p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-serif text-2xl text-[#171714]">Decision preferences</h2>
            <p className="mt-1 text-sm text-[#6E6A61]">
              These are saved on this device and guide every new suggestion.
            </p>
          </div>

          <label className="flex items-start justify-between gap-4 sm:gap-5 border-t border-[#DCD5C9]/60 pt-5 cursor-pointer">
            <span className="flex-1 min-w-0">
              <span className="block text-base font-medium text-[#171714]">Use leftovers for breakfast</span>
              <span className="block mt-1 text-sm text-[#6E6A61] leading-relaxed">Prioritize last night&apos;s meal the next morning.</span>
            </span>
            <input
              type="checkbox"
              checked={settings.allowLeftoversForBreakfast}
              onChange={(e) => updateSettings({ allowLeftoversForBreakfast: e.target.checked })}
              className="mt-1 size-5 accent-[#8A9B84] shrink-0"
            />
          </label>

          <label className="flex items-start justify-between gap-4 sm:gap-5 border-t border-[#DCD5C9]/60 pt-5 cursor-pointer">
            <span className="flex-1 min-w-0">
              <span className="block text-base font-medium text-[#171714]">Keep it easy by default</span>
              <span className="block mt-1 text-sm text-[#6E6A61] leading-relaxed">Favor meals marked quick when deciding.</span>
            </span>
            <input
              type="checkbox"
              checked={settings.keepItEasyDefault}
              onChange={(e) => updateSettings({ keepItEasyDefault: e.target.checked })}
              className="mt-1 size-5 accent-[#8A9B84] shrink-0"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#DCD5C9]/60 pt-5">
            <label className="text-base font-medium text-[#171714]">
              Household size
              <select
                value={settings.householdSize}
                onChange={(e) => updateSettings({ householdSize: Number(e.target.value) })}
                className="mt-2 min-h-12 w-full border border-[#DCD5C9] bg-[#F7F3EC] px-3 text-base rounded-xl focus:outline-none focus:border-[#8A9B84]"
              >
                {[1, 2, 3, 4, 5, 6].map((size) => (
                  <option key={size} value={size}>
                    {size} {size === 1 ? 'person' : 'people'}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-base font-medium text-[#171714]">
              Spice preference
              <select
                value={settings.spicinessPreference}
                onChange={(e) => updateSettings({ spicinessPreference: e.target.value as 'mild' | 'medium' | 'high' })}
                className="mt-2 min-h-12 w-full border border-[#DCD5C9] bg-[#F7F3EC] px-3 text-base rounded-xl focus:outline-none focus:border-[#8A9B84]"
              >
                <option value="mild">Mild</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>
        </section>

        <section className="border border-[#B76546]/30 bg-white rounded-2xl p-6 sm:p-8 space-y-4">
          <div>
            <h2 className="font-serif text-2xl text-[#171714]">Start over</h2>
            <p className="mt-1 text-sm text-[#6E6A61] leading-relaxed">
              Restore the starter pantry, meals, settings, and clear your local history.
            </p>
          </div>

          <div className="p-3 bg-[#F7F3EC] border border-[#DCD5C9] rounded-xl flex items-start gap-2">
            <Info className="w-4 h-4 text-[#6E6A61] shrink-0 mt-0.5" />
            <p className="text-xs text-[#6E6A61] leading-relaxed">
              This will reset all foods, meals, and preferences back to the original Dishcision starter library. Your personal additions will be removed.
            </p>
          </div>

          {confirmingReset ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="danger" size="md" onClick={() => { resetToStarterLibrary(); setConfirmingReset(false); }}>
                Yes, reset my app
              </Button>
              <Button variant="outline" size="md" onClick={() => setConfirmingReset(false)}>Cancel</Button>
            </div>
          ) : (
            <Button variant="outline" size="md" onClick={() => setConfirmingReset(true)} className="gap-2">
              <RotateCcw className="w-4 h-4" /> Reset to starter library
            </Button>
          )}
        </section>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
