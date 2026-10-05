import React, { useState, useEffect } from 'react';
import { GradeLevel, MoodEntry, Language } from '../types/game';
import { soundFx } from '../utils/audio';
import { getTranslation } from '../data/translations';
import {
  Heart,
  Sparkles,
  Wind,
  CheckCircle2,
  Smile,
  BatteryCharging,
  BookOpen,
  Calendar,
} from 'lucide-react';

interface MindAndMoodProps {
  gradeLevel: GradeLevel;
  language: Language;
  onMindfulComplete: (vitalityGained: number) => void;
}

const FEELINGS_LIST = [
  { id: 'joyful', label: 'Joyful & Happy', emoji: '😊', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'calm', label: 'Calm & Peaceful', emoji: '🌿', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { id: 'curious', label: 'Curious & Focused', emoji: '🧐', color: 'bg-sky-100 text-sky-900 border-sky-300' },
  { id: 'energetic', label: 'Energetic & Bouncy', emoji: '⚡', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
  { id: 'tired', label: 'Tired / Needs Rest', emoji: '🥱', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
  { id: 'anxious', label: 'Worried or Uneasy', emoji: '💭', color: 'bg-purple-100 text-purple-900 border-purple-300' },
  { id: 'frustrated', label: 'Frustrated / Grumpy', emoji: '🌩️', color: 'bg-rose-100 text-rose-900 border-rose-300' },
];

const JOURNAL_PROMPTS = [
  'What is one small thing that made you smile today?',
  'Who is a person or pet that makes you feel safe and appreciated?',
  'What is a challenge you faced recently, and what did you learn about yourself?',
  'Name a favorite song, book, or outdoor place that helps you feel relaxed.',
  'What is a strength you have that you are proud of?',
];

export const MindAndMood: React.FC<MindAndMoodProps> = ({
  gradeLevel,
  language,
  onMindfulComplete,
}) => {
  const [selectedFeeling, setSelectedFeeling] = useState<string>('calm');
  const [selectedEnergy, setSelectedEnergy] = useState<MoodEntry['energyLevel']>('steady');
  const [gratitudeNote, setGratitudeNote] = useState<string>('');
  const [journalPromptIdx, setJournalPromptIdx] = useState<number>(0);
  const [journalNote, setJournalNote] = useState<string>('');
  const [checkInSaved, setCheckInSaved] = useState<boolean>(false);

  // Box Breathing Exercise State
  const [breathingActive, setBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [breathCounter, setBreathCounter] = useState<number>(4);
  const [breathingCycleCount, setBreathingCycleCount] = useState<number>(0);

  // Gratitude Wall entries
  const [gratitudeWall, setGratitudeWall] = useState<string[]>([
    'Playing basketball at recess with my classmates.',
    'Warm vegetable soup on a rainy afternoon.',
    'Our dog greeting me at the front door with a wagging tail.',
  ]);

  // Box breathing 4-4-4-4 cycle effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathCounter((prev) => {
          if (prev <= 1) {
            // Transition phase
            setBreathPhase((currentPhase) => {
              if (currentPhase === 'Inhale') {
                soundFx.playClick();
                return 'Hold';
              } else if (currentPhase === 'Hold') {
                soundFx.playCalmBell();
                return 'Exhale';
              } else if (currentPhase === 'Exhale') {
                soundFx.playClick();
                return 'Pause';
              } else {
                soundFx.playCalmBell();
                setBreathingCycleCount((c) => c + 1);
                return 'Inhale';
              }
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [breathingActive]);

  const handleToggleBreathing = () => {
    if (!breathingActive) {
      soundFx.playCalmBell();
      setBreathingActive(true);
      setBreathPhase('Inhale');
      setBreathCounter(4);
    } else {
      setBreathingActive(false);
      if (breathingCycleCount >= 2) {
        onMindfulComplete(15);
      }
    }
  };

  const handleSaveCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playSuccess();
    if (gratitudeNote.trim()) {
      setGratitudeWall((prev) => [gratitudeNote.trim(), ...prev.slice(0, 5)]);
    }
    setCheckInSaved(true);
    onMindfulComplete(25);
    setTimeout(() => {
      setCheckInSaved(false);
      setGratitudeNote('');
      setJournalNote('');
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider">
            <span>Social-Emotional Learning & Mindfulness</span>
            <span>·</span>
            <span>Inner Weather</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            Mind & Mood Oasis
          </h1>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            All feelings are natural and welcome. Your emotions are like weather in the sky—they come, they teach us something, and they pass. Check in with your feelings and practice gentle box breathing!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Emotional & Energy Check-in Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <form onSubmit={handleSaveCheckIn} className="space-y-5">
            {/* Step 1: Feeling Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2">
                1. How does your "internal weather" feel right now?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FEELINGS_LIST.map((feeling) => {
                  const isSelected = selectedFeeling === feeling.id;
                  return (
                    <button
                      key={feeling.id}
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedFeeling(feeling.id);
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? `${feeling.color} font-bold shadow-xs scale-102 ring-2 ring-emerald-600`
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xl">{feeling.emoji}</span>
                      <span className="text-xs">{feeling.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Energy Battery */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <BatteryCharging className="w-4 h-4 text-emerald-600" />
                <span>2. Current Energy Battery Level:</span>
              </label>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {(['low', 'recharging', 'steady', 'vibrant'] as const).map((lvl) => {
                  const isSelected = selectedEnergy === lvl;
                  const labels = {
                    low: 'Low (Need Rest)',
                    recharging: 'Recharging',
                    steady: 'Steady & Calm',
                    vibrant: 'High & Bouncy',
                  };
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedEnergy(lvl);
                      }}
                      className={`py-2 px-2 rounded-xl border transition-all cursor-pointer capitalize ${
                        isSelected
                          ? 'bg-emerald-600 text-white font-bold border-emerald-700 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {labels[lvl]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Gratitude Leaf Prompt */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center justify-between">
                <span>3. One thing you are grateful for today:</span>
                <span className="text-[11px] text-emerald-700 font-normal">Grows a leaf in the Sanctuary</span>
              </label>
              <input
                type="text"
                value={gratitudeNote}
                onChange={(e) => setGratitudeNote(e.target.value)}
                placeholder="e.g. My grandma calling to say hi, or having quiet time to sketch..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-600"
                required
              />
            </div>

            {/* Step 4: Optional Journal Prompt */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-900">
                  4. Self-Compassion Journal Prompt:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setJournalPromptIdx((i) => (i + 1) % JOURNAL_PROMPTS.length);
                  }}
                  className="text-[11px] text-teal-700 hover:text-teal-900 font-medium cursor-pointer"
                >
                  Shuffle Prompt ↺
                </button>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-lg text-xs text-amber-950 mb-2 italic">
                "{JOURNAL_PROMPTS[journalPromptIdx]}"
              </div>
              <textarea
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                placeholder="Write a sentence or two here (optional)..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            {checkInSaved ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-center text-xs text-emerald-950 space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <div className="font-bold">Check-In Logged Mindfully!</div>
                <div>+25 Vitality Seeds awarded to your Companion!</div>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Save Daily Mindful Check-In</span>
              </button>
            )}
          </form>
        </div>

        {/* Right: Box Breathing Sanctuary & Gratitude Wall (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col justify-between space-y-6">
          {/* Box Breathing Mini-Tool */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-600" />
                <span>4-4-4-4 Box Breathing</span>
              </h3>
              <span className="text-xs text-slate-500">Nervous system reset</span>
            </div>

            {/* Interactive Breathing Visual Circle */}
            <div className="h-56 rounded-2xl bg-gradient-to-br from-teal-900 via-emerald-900 to-slate-900 text-white p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
              {/* Expanding breathing orb */}
              <div
                className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 ${
                  breathPhase === 'Inhale'
                    ? 'scale-125 border-teal-300 bg-teal-400/20 shadow-lg'
                    : breathPhase === 'Hold'
                    ? 'scale-125 border-amber-300 bg-amber-400/20'
                    : breathPhase === 'Exhale'
                    ? 'scale-90 border-sky-300 bg-sky-400/20'
                    : 'scale-90 border-purple-300 bg-purple-400/20'
                }`}
              >
                <span className="text-sm font-bold uppercase tracking-wider text-emerald-200 font-display">
                  {breathingActive ? breathPhase : 'Ready'}
                </span>
                <span className="text-2xl font-mono font-bold text-white tabular-nums">
                  {breathingActive ? breathCounter : '4'}
                </span>
              </div>

              <div className="text-xs text-teal-200 mt-4">
                {breathingActive
                  ? `Completed Cycles: ${breathingCycleCount}`
                  : 'Used by athletes and astronauts to find calm focus.'}
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleBreathing}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                breathingActive
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              {breathingActive ? 'Pause Breathing' : 'Start 1-Minute Box Breathing'}
            </button>
          </div>

          {/* Gratitude Wall Pinboard */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Sanctuary Gratitude Tree</span>
            </h4>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {gratitudeWall.map((note, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-amber-50/60 rounded-lg border border-amber-200/50 text-[11px] text-slate-700 flex items-start gap-1.5"
                >
                  <span className="text-emerald-600 font-bold">🍃</span>
                  <span className="leading-snug">{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
