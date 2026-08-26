'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFoodStore } from '@/lib/store/use-food-store';
import { RotateCcw } from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, resetToStarterLibrary } = useFoodStore();
  const [confirmingReset, setConfirmingReset] = useState(false);
  return <div className="min-h-screen bg-[#F7F3EC] flex flex-col pb-20 md:pb-0">
    <Header />
    <main className="container-editorial w-full max-w-3xl flex-1 py-8 sm:py-12 md:py-20 space-y-8">
      <div className="space-y-2"><Badge variant="sage">PREFERENCES</Badge><h1 className="font-serif text-4xl sm:text-5xl md:text-6xl">Settings</h1></div>
      <section className="bg-white border border-[#DCD5C9] p-5 sm:p-7 rounded-[2px] space-y-6"><div><h2 className="font-serif text-2xl">Decision preferences</h2><p className="mt-1 text-sm text-[#6E6A61]">These are saved on this device and guide every new suggestion.</p></div>
        <label className="flex items-start justify-between gap-5 border-t border-[#DCD5C9] pt-5 cursor-pointer"><span><span className="block text-sm font-medium">Use leftovers for breakfast</span><span className="block mt-1 text-xs text-[#6E6A61]">Prioritize last night’s meal the next morning.</span></span><input type="checkbox" checked={settings.allowLeftoversForBreakfast} onChange={(event) => updateSettings({ allowLeftoversForBreakfast: event.target.checked })} className="mt-1 size-5 accent-[#8A9B84]" /></label>
        <label className="flex items-start justify-between gap-5 border-t border-[#DCD5C9] pt-5 cursor-pointer"><span><span className="block text-sm font-medium">Keep it easy by default</span><span className="block mt-1 text-xs text-[#6E6A61]">Favor meals marked quick when deciding.</span></span><input type="checkbox" checked={settings.keepItEasyDefault} onChange={(event) => updateSettings({ keepItEasyDefault: event.target.checked })} className="mt-1 size-5 accent-[#8A9B84]" /></label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#DCD5C9] pt-5"><label className="text-sm font-medium">Household size<select value={settings.householdSize} onChange={(event) => updateSettings({ householdSize: Number(event.target.value) })} className="mt-2 min-h-11 w-full border border-[#DCD5C9] bg-[#F7F3EC] px-3 text-sm rounded-[2px] focus:outline-none focus:border-[#8A9B84]">{[1, 2, 3, 4, 5, 6].map((size) => <option key={size} value={size}>{size} {size === 1 ? 'person' : 'people'}</option>)}</select></label><label className="text-sm font-medium">Spice preference<select value={settings.spicinessPreference} onChange={(event) => updateSettings({ spicinessPreference: event.target.value as 'mild' | 'medium' | 'high' })} className="mt-2 min-h-11 w-full border border-[#DCD5C9] bg-[#F7F3EC] px-3 text-sm rounded-[2px] focus:outline-none focus:border-[#8A9B84]"><option value="mild">Mild</option><option value="medium">Medium</option><option value="high">High</option></select></label></div>
      </section>
      <section className="border border-[#B76546]/30 bg-white p-5 sm:p-7 rounded-[2px] space-y-4"><div><h2 className="font-serif text-2xl">Start over</h2><p className="mt-1 text-sm text-[#6E6A61]">Restore the starter pantry, meals, settings, and clear your local history.</p></div>{confirmingReset ? <div className="flex flex-col sm:flex-row gap-2"><Button variant="danger" size="md" onClick={() => { resetToStarterLibrary(); setConfirmingReset(false); }}>Yes, reset my app</Button><Button variant="outline" size="md" onClick={() => setConfirmingReset(false)}>Cancel</Button></div> : <Button variant="outline" size="md" onClick={() => setConfirmingReset(true)} className="gap-2"><RotateCcw className="w-4 h-4" /> Reset to starter library</Button>}</section>
    </main>
    <Footer /><BottomNav />
  </div>;
}
