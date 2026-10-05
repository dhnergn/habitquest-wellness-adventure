import React, { useState } from 'react';
import { GradeLevel, HabitLoopPreset, MythCard, Language } from '../types/game';
import { HABIT_LOOP_PRESETS, MYTH_CARDS } from '../data/wellnessData';
import { soundFx } from '../utils/audio';
import { getTranslation } from '../data/translations';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Globe,
} from 'lucide-react';

interface HabitScienceProps {
  gradeLevel: GradeLevel;
  language: Language;
  onMythComplete: (vitalityGained: number) => void;
}

interface CulturalWisdomItem {
  id: string;
  culture: string;
  flag: string;
  habitConcept: string;
  nativeTerm: string;
  icon: string;
  howItWorks: string;
  neuroscienceWhy: string;
}

const CULTURAL_WISDOM_ITEMS: CulturalWisdomItem[] = [
  {
    id: 'wisdom_china',
    culture: 'China (中华养生)',
    flag: '🇨🇳',
    habitConcept: 'Yangsheng: Nourishing Life in Harmony',
    nativeTerm: '天人合一 · 养生之道 (Yǎng Shēng)',
    icon: '🍵',
    howItWorks: 'Drinking warm fluids with meals, doing gentle stretches in the morning, and eating seasonal vegetables to stay balanced year-round.',
    neuroscienceWhy: 'Warmth promotes splanchnic blood circulation to the digestive organs, supporting nutrient absorption and reducing gut stress.',
  },
  {
    id: 'wisdom_spain',
    culture: 'Spain (España)',
    flag: '🇪🇸',
    habitConcept: 'La Sobremesa: Mindful Conversation After Eating',
    nativeTerm: 'La Sobremesa y la Charla Familiar',
    icon: '🗣️',
    howItWorks: 'Remaining seated at the table for 15-30 minutes after lunch or dinner with family, enjoying conversation without screens or rushing.',
    neuroscienceWhy: 'Unrushed social safety triggers the parasympathetic nervous system ("rest and digest"), decreasing cortisol and maximizing digestion.',
  },
  {
    id: 'wisdom_turkey',
    culture: 'Turkey (Türkiye)',
    flag: '🇹🇷',
    habitConcept: 'Akşam Yürüyüşü & Kolonya Hygiene',
    nativeTerm: 'Akşam Yürüyüşü ve Limon Kolonyası',
    icon: '🚶',
    howItWorks: 'A gentle evening neighborhood walk after dinner with friends or family, and refreshing hands with natural scented citrus essence.',
    neuroscienceWhy: 'A 15-minute post-prandial (after meal) stroll flattens post-meal glucose spikes by letting working leg muscles absorb blood sugar directly without high insulin spikes.',
  },
  {
    id: 'wisdom_india',
    culture: 'India (भारत)',
    flag: '🇮🇳',
    habitConcept: 'Dinacharya & Pranayama: Mindful Daily Rhythm',
    nativeTerm: 'दिनचर्या और प्राणायाम (Daily Rhythm & Breath)',
    icon: '🧘',
    howItWorks: 'Waking at a consistent morning hour, hydrating with warm water, practicing 5 minutes of focused breathing (Pranayama), and eating with mindful gratitude.',
    neuroscienceWhy: 'Rhythmic diaphragmatic breathing stimulates the vagus nerve, immediately moderating the amygdala and sharpening prefrontal executive focus.',
  },
  {
    id: 'wisdom_france',
    culture: 'France (France)',
    flag: '🇫🇷',
    habitConcept: 'Le Goûter: Structured Mindful Afternoon Snack',
    nativeTerm: 'La Pause Goûter et Repas à Table',
    icon: '🥖',
    howItWorks: 'Sitting down at 4:30 PM for a structured, delicious recharge (whole grain bread, piece of fruit, water) rather than mindless grazing throughout the afternoon.',
    neuroscienceWhy: 'Clear eating intervals protect hunger-satiety hormones (ghrelin and leptin), teaching the brain to recognize genuine hunger and full satisfaction.',
  },
];

export const HabitScience: React.FC<HabitScienceProps> = ({
  gradeLevel,
  language,
  onMythComplete,
}) => {
  const [activeSection, setActiveSection] = useState<'myth_busters' | 'habit_loop' | 'cultural_wisdom'>('myth_busters');

  // Myth Buster State
  const [currentMythIdx, setCurrentMythIdx] = useState<number>(0);
  const [answeredState, setAnsweredState] = useState<'unanswered' | 'correct' | 'incorrect'>('unanswered');
  const [mythsCompletedCount, setMythsCompletedCount] = useState<number>(0);

  // Habit Loop State
  const [selectedPresetId, setSelectedPresetId] = useState<string>(HABIT_LOOP_PRESETS[0].id);
  const [customCue, setCustomCue] = useState<string>('');
  const [customRoutine, setCustomRoutine] = useState<string>('');
  const [customReward, setCustomReward] = useState<string>('');
  const [customSaved, setCustomSaved] = useState<boolean>(false);

  // Cultural Wisdom State
  const [selectedWisdomIdx, setSelectedWisdomIdx] = useState<number>(0);

  const currentMyth: MythCard = MYTH_CARDS[currentMythIdx];
  const activePreset = HABIT_LOOP_PRESETS.find((p) => p.id === selectedPresetId) || HABIT_LOOP_PRESETS[0];
  const activeWisdom = CULTURAL_WISDOM_ITEMS[selectedWisdomIdx];

  const handleAnswerMyth = (studentChoice: boolean) => {
    const isCorrect = studentChoice === currentMyth.isTrue;
    if (isCorrect) {
      soundFx.playSuccess();
      setAnsweredState('correct');
      setMythsCompletedCount((c) => c + 1);
      onMythComplete(15);
    } else {
      soundFx.playClick();
      setAnsweredState('incorrect');
    }
  };

  const handleNextMyth = () => {
    soundFx.playClick();
    setAnsweredState('unanswered');
    setCurrentMythIdx((prev) => (prev + 1) % MYTH_CARDS.length);
  };

  const handleSaveCustomLoop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCue.trim() || !customRoutine.trim() || !customReward.trim()) return;
    soundFx.playSuccess();
    setCustomSaved(true);
    onMythComplete(20);
    setTimeout(() => setCustomSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider">
            <span>{getTranslation(language, 'appName')}</span>
            <span>·</span>
            <span>{getTranslation(language, 'habitScienceTitle')}</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            {getTranslation(language, 'habitScienceTitle')}
          </h1>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            {getTranslation(language, 'habitScienceSubtitle')}
          </p>
        </div>

        {/* Section Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveSection('myth_busters');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'myth_busters'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {getTranslation(language, 'mythBusterTitle')}
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveSection('cultural_wisdom');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeSection === 'cultural_wisdom'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{getTranslation(language, 'culturalWisdomTitle')}</span>
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveSection('habit_loop');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'habit_loop'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {getTranslation(language, 'habitLoopTitle')}
          </button>
        </div>
      </div>

      {/* Section 1: Myth Busters */}
      {activeSection === 'myth_busters' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                  Myth Card #{currentMythIdx + 1} of {MYTH_CARDS.length} · {currentMyth.category.toUpperCase()}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Cards Mastered: <strong>{mythsCompletedCount}</strong>
                </span>
              </div>

              {/* Card Question */}
              <div className="bg-amber-50/50 rounded-2xl p-6 sm:p-8 border border-amber-200/60 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-white shadow-xs mx-auto flex items-center justify-center text-indigo-600">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 leading-snug">
                  "{currentMyth.myth}"
                </h3>
              </div>

              {/* True / False Buttons */}
              {answeredState === 'unanswered' && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleAnswerMyth(true)}
                    className="py-3 px-4 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{getTranslation(language, 'mythTrue')}</span>
                  </button>
                  <button
                    onClick={() => handleAnswerMyth(false)}
                    className="py-3 px-4 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-950 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>{getTranslation(language, 'mythFalse')}</span>
                  </button>
                </div>
              )}

              {/* Answer Explanation */}
              {answeredState !== 'unanswered' && (
                <div
                  className={`p-4 rounded-xl border space-y-2 animate-in fade-in duration-200 ${
                    answeredState === 'correct'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {answeredState === 'correct' ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>You Debunked It! (+15 Seeds)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-amber-600" />
                        <span>Not quite! Here is what science reveals:</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs font-semibold leading-relaxed">
                    Fact: {currentMyth.fact}
                  </p>
                  <p className="text-xs leading-relaxed opacity-90">
                    {currentMyth.whyExplanation}
                  </p>
                  <div className="text-[10px] text-slate-500 pt-1">
                    Source: {currentMyth.cdcReference}
                  </div>
                </div>
              )}
            </div>

            {/* Next Card Button */}
            {answeredState !== 'unanswered' && (
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={handleNextMyth}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next Challenge Card</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>The Habit Science Principle</span>
              </h3>
              <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/60 text-xs text-slate-700 space-y-2">
                <div className="font-semibold text-slate-900">Why Debunking Health Myths Matters:</div>
                <p className="leading-relaxed">
                  Diet culture, extreme workouts, and all-or-nothing thinking cause frustration and burnout. True sustainable wellness is gentle, realistic, and lifelong!
                </p>
              </div>
            </div>

            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-xs text-indigo-950 flex items-start gap-2">
              <Brain className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
              <div>
                <strong>Cognitive Re-framing:</strong> Healthy habits are built one choice at a time. A rest day or enjoying a treat is a healthy part of a balanced life!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Global Wellness Traditions */}
      {activeSection === 'cultural_wisdom' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {CULTURAL_WISDOM_ITEMS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedWisdomIdx(idx);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedWisdomIdx === idx
                    ? 'bg-amber-100/70 border-amber-400 font-bold shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-lg mb-1">
                  <span>{item.flag}</span>
                  <span>{item.icon}</span>
                </div>
                <div className="text-xs text-slate-900 font-display truncate">{item.culture}</div>
                <div className="text-[10px] text-slate-500 truncate">{item.nativeTerm.split(' ')[0]}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <span>{activeWisdom.flag}</span>
                  <span>{activeWisdom.culture}</span>
                </span>
                <span className="text-2xl">{activeWisdom.icon}</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold font-display text-slate-900">
                  {activeWisdom.habitConcept}
                </h3>
                <p className="text-xs text-amber-900 font-medium italic">
                  {activeWisdom.nativeTerm}
                </p>
              </div>

              <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/60 text-xs text-slate-800 space-y-2">
                <div className="font-semibold text-slate-900">Daily Cultural Practice:</div>
                <p className="leading-relaxed">{activeWisdom.howItWorks}</p>
              </div>

              <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200/60 text-xs text-slate-800 space-y-2">
                <div className="font-semibold text-slate-900 flex items-center gap-1">
                  <Brain className="w-4 h-4 text-emerald-700" />
                  <span>The Neurobiological & Physiology Secret:</span>
                </div>
                <p className="leading-relaxed">{activeWisdom.neuroscienceWhy}</p>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>Why Global Wisdom Works</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Centuries before smartwatches or calorie trackers, cultures across Asia, Europe, and the Mediterranean designed peaceful daily rhythms honoring community meals, natural movement, and seasonal rest.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Try it today:</strong> Pick one cultural habit (like Spain's unhurried dinner conversation or China's warm foot soak) to try with your family!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Habit Loop Explorer */}
      {activeSection === 'habit_loop' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold font-display text-slate-900 mb-1">
                The Cue → Routine → Reward Blueprint
              </h3>
              <p className="text-xs text-slate-600">
                Automatic habits form when an environmental cue prompts a routine that satisfies an underlying craving or reward.
              </p>
            </div>

            {/* Presets Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {HABIT_LOOP_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedPresetId(preset.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    selectedPresetId === preset.id
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Visual Loop Representation */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                  1. The Cue (Trigger)
                </span>
                <p className="text-xs text-slate-800 font-medium">{activePreset.cue}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-rose-50/70 p-3 rounded-lg border border-rose-200 space-y-1">
                  <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
                    Old Habit Routine
                  </span>
                  <p className="text-xs text-rose-950">{activePreset.oldRoutine}</p>
                </div>
                <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    New Healthy Routine
                  </span>
                  <p className="text-xs text-emerald-950 font-semibold">
                    {activePreset.newHealthyRoutine}
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                  3. The Satisfying Reward
                </span>
                <p className="text-xs text-slate-800 font-medium">{activePreset.reward}</p>
              </div>

              <div className="text-[11px] text-slate-500 italic pt-1">
                💡 Habit Architect Tip: {activePreset.scienceTip}
              </div>
            </div>
          </div>

          {/* Design Your Own Custom Habit Loop */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-600" />
                <span>Design Your Personal Habit Loop</span>
              </h3>

              <form onSubmit={handleSaveCustomLoop} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cue (When or where does it start?):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. As soon as I wake up..."
                    value={customCue}
                    onChange={(e) => setCustomCue(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Healthy Routine (What positive micro-step will you do?):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Drink 1 glass of water and stretch..."
                    value={customRoutine}
                    onChange={(e) => setCustomRoutine(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reward (How will you celebrate or feel good?):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Feeling alert, high-fiving my companion..."
                    value={customReward}
                    onChange={(e) => setCustomReward(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!customCue || !customRoutine || !customReward}
                  className="w-full py-2 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer disabled:opacity-40"
                >
                  Save Habit Loop (+20 Seeds)
                </button>

                {customSaved && (
                  <div className="text-center text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    Habit loop engineered! Consistency creates automatic brain pathways.
                  </div>
                )}
              </form>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Neuroscience Fact:</strong> The basal ganglia automates repeated routines after 3 to 6 weeks, freeing up your prefrontal cortex for creativity!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
