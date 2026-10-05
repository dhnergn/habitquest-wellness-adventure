/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { Sanctuary } from './components/Sanctuary';
import { MealBuilder } from './components/MealBuilder';
import { MovementStudio } from './components/MovementStudio';
import { SleepLab } from './components/SleepLab';
import { MindAndMood } from './components/MindAndMood';
import { HabitScience } from './components/HabitScience';
import { Achievements } from './components/Achievements';
import { EducatorDashboard } from './components/EducatorDashboard';
import {
  Companion,
  GardenPlant,
  GradeLevel,
  Language,
  Quest,
  Badge,
  WeeklyChallenge,
} from './types/game';
import {
  INITIAL_BADGES,
  INITIAL_GARDEN_PLANTS,
  INITIAL_QUESTS,
  WEEKLY_CHALLENGE,
} from './data/wellnessData';
import { soundFx } from './utils/audio';

const STORAGE_KEY = 'habitquest_game_state_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('sanctuary');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('elementary');
  const [language, setLanguage] = useState<Language>('en');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Companion state
  const [companion, setCompanion] = useState<Companion>({
    name: 'Sprout the Forest Fox',
    species: 'fox',
    title: 'Curious Forest Companion',
    level: 3,
    vitality: 85,
    joy: 92,
    favoriteActivity: 'Stretching under the morning sun',
    outfit: 'cozy_scarf',
    colorTheme: 'emerald',
  });

  const [vitalitySeeds, setVitalitySeeds] = useState<number>(145);
  const [streak, setStreak] = useState<number>(5);
  const [streakShieldActive, setStreakShieldActive] = useState<boolean>(true);

  // Garden plants state
  const [gardenPlants, setGardenPlants] = useState<GardenPlant[]>(INITIAL_GARDEN_PLANTS);

  // Quests state
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);

  // Badges state
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);

  // Community Weekly Challenge state
  const [weeklyChallenge, setWeeklyChallenge] = useState<WeeklyChallenge>(WEEKLY_CHALLENGE);

  // Load from localStorage on mount if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.companion) setCompanion(parsed.companion);
        if (typeof parsed.vitalitySeeds === 'number') setVitalitySeeds(parsed.vitalitySeeds);
        if (typeof parsed.streak === 'number') setStreak(parsed.streak);
        if (typeof parsed.streakShieldActive === 'boolean') setStreakShieldActive(parsed.streakShieldActive);
        if (parsed.gradeLevel) setGradeLevel(parsed.gradeLevel);
        if (parsed.language) setLanguage(parsed.language);
      }
    } catch {
      // safe fallback
    }
  }, []);

  // Persist key state
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          companion,
          vitalitySeeds,
          streak,
          streakShieldActive,
          gradeLevel,
          language,
        })
      );
    } catch {
      // safe ignore
    }
  }, [companion, vitalitySeeds, streak, streakShieldActive, gradeLevel, language]);

  // Navigate to interactive tool when requested from quest
  const handleOpenTool = (toolName: string) => {
    soundFx.playClick();
    if (toolName === 'meal_builder') setActiveTab('meal_builder');
    else if (toolName === 'movement') setActiveTab('movement');
    else if (toolName === 'sleep') setActiveTab('sleep');
    else if (toolName === 'mood') setActiveTab('mind_mood');
    else if (toolName === 'habit_science') setActiveTab('habit_science');
  };

  const handleGainVitality = (amount: number) => {
    setVitalitySeeds((prev) => prev + amount);
    setCompanion((c) => ({
      ...c,
      vitality: Math.min(100, c.vitality + Math.round(amount / 3)),
      joy: Math.min(100, c.joy + Math.round(amount / 4)),
    }));
    setWeeklyChallenge((wc) => ({ ...wc, currentCount: wc.currentCount + 1 }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-slate-800 antialiased">
      {/* Strict 3-Zone Top Navigation Bar */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gradeLevel={gradeLevel}
        setGradeLevel={setGradeLevel}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        vitalitySeeds={vitalitySeeds}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'sanctuary' && (
          <Sanctuary
            companion={companion}
            setCompanion={setCompanion}
            gardenPlants={gardenPlants}
            setGardenPlants={setGardenPlants}
            quests={quests}
            setQuests={setQuests}
            streak={streak}
            streakShieldActive={streakShieldActive}
            setStreakShieldActive={setStreakShieldActive}
            vitalitySeeds={vitalitySeeds}
            setVitalitySeeds={setVitalitySeeds}
            onOpenTool={handleOpenTool}
            gradeLevel={gradeLevel}
            weeklyChallenge={weeklyChallenge}
            setWeeklyChallenge={setWeeklyChallenge}
            language={language}
          />
        )}

        {activeTab === 'meal_builder' && (
          <MealBuilder
            gradeLevel={gradeLevel}
            language={language}
            onMealComplete={handleGainVitality}
          />
        )}

        {activeTab === 'movement' && (
          <MovementStudio
            gradeLevel={gradeLevel}
            language={language}
            onActivityComplete={handleGainVitality}
          />
        )}

        {activeTab === 'sleep' && (
          <SleepLab
            gradeLevel={gradeLevel}
            language={language}
            onRoutineCompleted={handleGainVitality}
          />
        )}

        {activeTab === 'mind_mood' && (
          <MindAndMood
            gradeLevel={gradeLevel}
            language={language}
            onMindfulComplete={handleGainVitality}
          />
        )}

        {activeTab === 'habit_science' && (
          <HabitScience
            gradeLevel={gradeLevel}
            language={language}
            onMythComplete={handleGainVitality}
          />
        )}

        {activeTab === 'badges' && (
          <Achievements
            badges={badges}
            setBadges={setBadges}
            companion={companion}
            setCompanion={setCompanion}
            vitalitySeeds={vitalitySeeds}
            setVitalitySeeds={setVitalitySeeds}
            language={language}
          />
        )}

        {activeTab === 'educator' && (
          <EducatorDashboard
            gradeLevel={gradeLevel}
            language={language}
          />
        )}
      </main>

      {/* Clean, quiet footer obeying universal design guidelines */}
      <footer className="border-t border-amber-900/10 bg-white/70 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">HabitQuest: Wellness Adventure</span>
            <span>·</span>
            <span>Ages 8–14 Health & Wellness Game</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>COPPA-Compliant & Privacy First</span>
            <span>·</span>
            <span>Aligned with CDC Healthy Schools & NHES</span>
            <span>·</span>
            <span>English, 中文, Español, Türkçe, हिन्दी, Français</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
