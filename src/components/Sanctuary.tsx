import React, { useState, useEffect } from 'react';
import {
  Companion,
  GardenPlant,
  GradeLevel,
  Language,
  Quest,
  WeeklyChallenge,
} from '../types/game';
import { soundFx } from '../utils/audio';
import { getTranslation } from '../data/translations';
import {
  Sparkles,
  Droplet,
  Shield,
  Heart,
  HelpCircle,
  CheckCircle2,
  Smile,
  Timer,
  Info,
  ChevronRight,
  Flame,
  Flower2,
  Users,
  Feather,
} from 'lucide-react';

interface SanctuaryProps {
  companion: Companion;
  setCompanion: React.Dispatch<React.SetStateAction<Companion>>;
  gardenPlants: GardenPlant[];
  setGardenPlants: React.Dispatch<React.SetStateAction<GardenPlant[]>>;
  quests: Quest[];
  setQuests: React.Dispatch<React.SetStateAction<Quest[]>>;
  streak: number;
  streakShieldActive: boolean;
  setStreakShieldActive: (active: boolean) => void;
  vitalitySeeds: number;
  setVitalitySeeds: React.Dispatch<React.SetStateAction<number>>;
  onOpenTool: (toolName: string) => void;
  gradeLevel: GradeLevel;
  weeklyChallenge: WeeklyChallenge;
  setWeeklyChallenge: React.Dispatch<React.SetStateAction<WeeklyChallenge>>;
  language: Language;
}

export const Sanctuary: React.FC<SanctuaryProps> = ({
  companion,
  setCompanion,
  gardenPlants,
  setGardenPlants,
  quests,
  setQuests,
  streak,
  streakShieldActive,
  vitalitySeeds,
  setVitalitySeeds,
  onOpenTool,
  gradeLevel,
  weeklyChallenge,
  setWeeklyChallenge,
  language,
}) => {
  const [selectedCompanionSpecies, setSelectedCompanionSpecies] = useState(companion.species);
  const [companionMessage, setCompanionMessage] = useState(
    "Hello friend! I'm feeling energized. Every healthy choice you make helps us both grow resiliently!"
  );
  const [activeTimerSeconds, setActiveTimerSeconds] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [expandedQuestWhy, setExpandedQuestWhy] = useState<string | null>(null);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [reflectionInput, setReflectionInput] = useState('');
  const [reflectionSuccess, setReflectionSuccess] = useState(false);

  // Brush teeth timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && activeTimerSeconds !== null && activeTimerSeconds > 0) {
      interval = setInterval(() => {
        setActiveTimerSeconds((prev) => {
          if (prev === null || prev <= 1) {
            setTimerRunning(false);
            soundFx.playSuccess();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, activeTimerSeconds]);

  // Pet companion action
  const handlePetCompanion = () => {
    soundFx.playClick();
    const greetings = [
      `*Wiggles happily* "That gentle stretch earlier made my paws feel lighter!"`,
      `"Remember: sipping water keeps your brain clear for puzzles and creative ideas!"`,
      `"Taking things one step at a time is the secret superpower of all great adventurers."`,
      `"I'm so proud of your consistency. You don't have to be perfect, just curious!"`,
      `"Resting well tonight means tomorrow will be full of fun discoveries!"`,
    ];
    const randomMsg = greetings[Math.floor(Math.random() * greetings.length)];
    setCompanionMessage(randomMsg);
    setCompanion((prev) => ({
      ...prev,
      joy: Math.min(100, prev.joy + 5),
    }));
  };

  // Feed harvested berry
  const handleFeedCompanion = () => {
    soundFx.playSuccess();
    setCompanionMessage(`*Nom nom* "Delicious whole fruit crispness! Packed with natural vitamins!"`);
    setCompanion((prev) => ({
      ...prev,
      vitality: Math.min(100, prev.vitality + 8),
      joy: Math.min(100, prev.joy + 6),
    }));
  };

  // Water cup tracker
  const handleWaterClick = (index: number) => {
    soundFx.playWaterDrop();
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === 'quest_hydration') {
          const newCount = index + 1;
          const completed = newCount >= (q.targetCount || 6);
          if (completed && !q.completed) {
            soundFx.playSuccess();
            setVitalitySeeds((s) => s + q.vitalityReward);
            setWeeklyChallenge((wc) => ({ ...wc, currentCount: wc.currentCount + 1 }));
          }
          return {
            ...q,
            currentCount: newCount,
            completed,
          };
        }
        return q;
      })
    );
  };

  // Complete generic quest
  const handleToggleQuest = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId) {
          const nextCompleted = !q.completed;
          if (nextCompleted) {
            soundFx.playSuccess();
            setVitalitySeeds((s) => s + q.vitalityReward);
            setWeeklyChallenge((wc) => ({ ...wc, currentCount: wc.currentCount + 1 }));
            // Also grow related garden plant
            setGardenPlants((plants) =>
              plants.map((p) => {
                if (p.pillar === q.pillar) {
                  return { ...p, stage: Math.min(3, p.stage + 1) };
                }
                return p;
              })
            );
          }
          return { ...q, completed: nextCompleted };
        }
        return q;
      })
    );
  };

  const startToothbrushTimer = () => {
    soundFx.playClick();
    setActiveTimerSeconds(120);
    setTimerRunning(true);
  };

  const speciesOptions: { id: Companion['species']; name: string; avatarChar: string }[] = [
    { id: 'fox', name: 'Sprout the Fox', avatarChar: '🦊' },
    { id: 'owl', name: 'Pip the Owl', avatarChar: '🦉' },
    { id: 'otter', name: 'Aqua the Otter', avatarChar: '🦦' },
    { id: 'bear', name: 'Moss the Bear', avatarChar: '🐻' },
    { id: 'pup', name: 'Spark the Pup', avatarChar: '🐶' },
  ];

  const handleSpeciesChange = (species: Companion['species']) => {
    soundFx.playClick();
    setSelectedCompanionSpecies(species);
    setCompanion((prev) => ({
      ...prev,
      species,
      name: speciesOptions.find((s) => s.id === species)?.name || 'Companion',
    }));
  };

  const submitDailyReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionInput.trim()) return;
    soundFx.playSuccess();
    setVitalitySeeds((s) => s + 20);
    setReflectionSuccess(true);
    setTimeout(() => {
      setShowReflectionModal(false);
      setReflectionSuccess(false);
      setReflectionInput('');
    }, 1400);
  };

  const hydrationQuest = quests.find((q) => q.id === 'quest_hydration');
  const waterGlasses = [1, 2, 3, 4, 5, 6];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome & Streak Shield Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-radial from-emerald-500/15 to-transparent pointer-events-none rounded-full blur-2xl -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
              <span>Wellness Sanctuary</span>
              <span>·</span>
              <span>Daily Habits, Lifelong Energy</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
              {getTranslation(language, 'sanctuaryWelcome')}
            </h1>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              {getTranslation(language, 'sanctuaryDesc')}
            </p>
          </div>

          {/* Gentle Streak Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 min-w-[240px] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
                <span className="font-bold text-lg text-white font-display tabular-nums">
                  {streak} Days Active
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-300 text-xs font-medium bg-emerald-950/40 px-2 py-0.5 rounded-full">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Rest Shield</span>
              </div>
            </div>
            <p className="text-xs text-emerald-100/80 leading-snug">
              {streakShieldActive
                ? 'Gentle Streak Shield is active: Rest days are healthy growth, not lost progress!'
                : 'Consistency over perfection. You are building habits for life.'}
            </p>
            <button
              onClick={() => setShowReflectionModal(true)}
              className="w-full mt-2 py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Evening Check-In (+20 Seeds)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Companion Haven (Left) & Habit Garden (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Companion Interactive Stage (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">
                  {companion.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Level {companion.level} Companion · Gentle Guide
                </p>
              </div>

              {/* Species selector pills */}
              <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-lg border border-amber-200/60">
                {speciesOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSpeciesChange(opt.id)}
                    className={`p-1.5 rounded-md text-base transition-transform cursor-pointer ${
                      selectedCompanionSpecies === opt.id
                        ? 'bg-white shadow-xs scale-110'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    title={`Switch companion to ${opt.name}`}
                  >
                    {opt.avatarChar}
                  </button>
                ))}
              </div>
            </div>

            {/* Companion Speech Bubble */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 mb-4 text-xs text-amber-950 leading-relaxed relative">
              <div className="absolute -bottom-2 left-10 w-3 h-3 bg-amber-50/80 border-r border-b border-amber-200/80 transform rotate-45" />
              <p className="italic">"{companionMessage}"</p>
            </div>

            {/* Visual Companion Stage */}
            <div className="relative aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden border border-emerald-900/10 shadow-inner group">
              <img
                src="/src/assets/images/hero_companion_mascot_1790230877200.jpg"
                alt="Companion Mascot"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[11px] font-medium">
                Tap to interact
              </div>
            </div>

            {/* Vitality & Joy Bars */}
            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Flourishing Vitality
                  </span>
                  <span className="text-slate-600 font-mono tabular-nums">{companion.vitality}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${companion.vitality}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-800 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    Joy & Calm Spirit
                  </span>
                  <span className="text-slate-600 font-mono tabular-nums">{companion.joy}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${companion.joy}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interaction buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={handlePetCompanion}
              className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Smile className="w-4 h-4 text-amber-600" />
              <span>Pet & Talk</span>
            </button>
            <button
              onClick={handleFeedCompanion}
              className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Offer Harvest Snack</span>
            </button>
          </div>
        </div>

        {/* Habit Garden Metaphor (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background scene overlay */}
          <div className="relative h-44 rounded-xl overflow-hidden mb-4 border border-amber-900/10">
            <img
              src="/src/assets/images/habitat_cozy_garden_1790230888838.jpg"
              alt="Habit Garden Sanctuary"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  Visual Growth Metaphor
                </span>
                <h3 className="text-base font-bold text-white font-display">
                  Your Living Habit Garden
                </h3>
                <p className="text-xs text-slate-200">
                  Each pillar of health grows a botanical companion. They never wither—they just rest when you do.
                </p>
              </div>
            </div>
          </div>

          {/* Garden Plants Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {gardenPlants.map((plant) => {
              const stageNames = ['Seed in Soil', 'Fresh Sprout', 'Budding Flower', 'Vibrant Bloom'];
              return (
                <div
                  key={plant.id}
                  className="bg-amber-50/40 rounded-xl p-3 border border-amber-200/50 hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{plant.name}</span>
                      <Flower2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-700">
                      {stageNames[plant.stage]} (Tier {plant.stage + 1}/4)
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      {plant.benefit}
                    </p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${((plant.stage + 1) / 4) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Community Weekly Challenge Banner */}
          <div className="mt-4 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>{weeklyChallenge.title}</span>
              </div>
              <p className="text-xs text-emerald-800">
                {weeklyChallenge.description} ({weeklyChallenge.participantsNote})
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs font-bold text-emerald-950 font-mono tabular-nums">
                {weeklyChallenge.currentCount} / {weeklyChallenge.targetCount} Sparks
              </div>
              <div className="text-[11px] text-emerald-700">
                {weeklyChallenge.daysRemaining} days remaining
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Habit Quests Section */}
      <div className="bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              {getTranslation(language, 'questsHeading')}
            </h2>
            <p className="text-xs text-slate-500">
              {getTranslation(language, 'questsSubtitle')}
            </p>
          </div>
          <div className="text-xs text-slate-600 font-medium">
            Completed:{' '}
            <span className="font-bold text-emerald-700 font-mono tabular-nums">
              {quests.filter((q) => q.completed).length} / {quests.length}
            </span>
          </div>
        </div>

        {/* Interactive Hydration Widget */}
        {hydrationQuest && (
          <div className="bg-sky-50/60 rounded-xl p-4 border border-sky-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shadow-xs">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Hydration Explorer: 6 Cups of Clean Water
                  </h3>
                  <p className="text-xs text-slate-600">
                    Tap a cup each time you drink water today. Keeps brain focus sharp!
                  </p>
                </div>
              </div>
              <div className="text-xs font-semibold text-sky-800">
                +15 Vitality Seeds
              </div>
            </div>

            {/* 6 interactive water glasses */}
            <div className="flex items-center gap-3 pt-1">
              {waterGlasses.map((glassNum, idx) => {
                const isFilled = (hydrationQuest.currentCount || 0) >= glassNum;
                return (
                  <button
                    key={glassNum}
                    onClick={() => handleWaterClick(idx)}
                    className={`flex-1 py-2 rounded-lg border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      isFilled
                        ? 'bg-sky-500 border-sky-600 text-white shadow-xs scale-102'
                        : 'bg-white border-sky-200 text-sky-400 hover:bg-sky-100/60'
                    }`}
                    title={`Cup ${glassNum}`}
                  >
                    <Droplet className={`w-4 h-4 ${isFilled ? 'fill-white' : ''}`} />
                    <span className="text-[11px] font-bold">{glassNum}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quest List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quests
            .filter((q) => q.id !== 'quest_hydration')
            .map((quest) => {
              const isExpanded = expandedQuestWhy === quest.id;
              const isDental = quest.id === 'quest_dental_twomin';

              return (
                <div
                  key={quest.id}
                  className={`rounded-xl p-4 border transition-all flex flex-col justify-between ${
                    quest.completed
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleQuest(quest.id)}
                          className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                            quest.completed
                              ? 'bg-emerald-600 text-white'
                              : 'border border-slate-300 hover:border-slate-400 text-transparent'
                          }`}
                          aria-label={`Mark ${quest.title} as ${quest.completed ? 'incomplete' : 'complete'}`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <h4
                          className={`text-sm font-bold ${
                            quest.completed ? 'line-through text-slate-500' : 'text-slate-900'
                          }`}
                        >
                          {quest.title}
                        </h4>
                      </div>
                      <span className="text-xs font-semibold text-emerald-800 font-mono shrink-0">
                        +{quest.vitalityReward} Seeds
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mb-3 ml-8 leading-relaxed">
                      {quest.description}
                    </p>

                    {/* Toothbrushing interactive 2-min timer special widget */}
                    {isDental && (
                      <div className="ml-8 mb-3 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-amber-950 flex items-center gap-1">
                            <Timer className="w-3.5 h-3.5" />
                            2-Minute Enamel Brush Timer
                          </span>
                          <span className="font-mono font-bold text-amber-900">
                            {activeTimerSeconds !== null
                              ? `${Math.floor(activeTimerSeconds / 60)}:${(activeTimerSeconds % 60).toString().padStart(2, '0')}`
                              : '2:00'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={startToothbrushTimer}
                            disabled={timerRunning}
                            className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                              timerRunning
                                ? 'bg-amber-200 text-amber-900'
                                : 'bg-amber-600 hover:bg-amber-700 text-white'
                            }`}
                          >
                            {timerRunning ? 'Brushing in progress...' : 'Start 2-Min Timer'}
                          </button>
                          <span className="text-[11px] text-amber-800">
                            (Gentle circles along teeth & gumlines)
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Expandable "The Why" Drawer */}
                    {isExpanded && (
                      <div className="ml-8 mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1 animate-fadeIn">
                        <div className="flex items-center gap-1 text-slate-900 font-semibold">
                          <Info className="w-3.5 h-3.5 text-emerald-600" />
                          <span>The Science Behind It</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{quest.whyItMatters}</p>
                        {gradeLevel === 'middle_school' && (
                          <p className="text-slate-500 italic text-[11px] pt-1 border-t border-slate-200">
                            Biology detail: {quest.scientificConcept}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2 ml-8">
                    <button
                      onClick={() => setExpandedQuestWhy(isExpanded ? null : quest.id)}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'Hide the why' : 'Why this matters'}</span>
                    </button>

                    {quest.interactiveTool && (
                      <button
                        onClick={() => onOpenTool(quest.interactiveTool!)}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-md"
                      >
                        <span>Open Sandbox</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Evening Reflection Modal */}
      {showReflectionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-amber-900/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Feather className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Daily Evening Reflection
                </h3>
              </div>
              <button
                onClick={() => setShowReflectionModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Habits grow through compassionate awareness, not self-criticism. Take 30 seconds to reflect on your day.
            </p>

            {reflectionSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="text-sm font-bold text-emerald-950">Reflection Saved!</div>
                <div className="text-xs text-emerald-800">+20 Vitality Seeds awarded to your Companion!</div>
              </div>
            ) : (
              <form onSubmit={submitDailyReflection} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    What was one thing that felt good or gave you energy today?
                  </label>
                  <textarea
                    value={reflectionInput}
                    onChange={(e) => setReflectionInput(e.target.value)}
                    placeholder="e.g. Taking a walk with my dog after school, drinking cold water during soccer, or reading my book..."
                    rows={3}
                    className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    required
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-lg text-[11px] text-amber-950">
                  🌱 <strong>Rest Note:</strong> If today was tough or you missed a habit, that is completely okay. Rest is essential for trees, animals, and humans alike!
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReflectionModal(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                  >
                    Save & Earn Seeds
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
