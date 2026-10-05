/**
 * Core type definitions for HabitQuest: Wellness Adventure
 */

export type PillarType = 'nutrition' | 'activity' | 'sleep' | 'hygiene' | 'mental' | 'habit_science';

export type CompanionSpecies = 'fox' | 'owl' | 'otter' | 'bear' | 'pup';

export type GradeLevel = 'elementary' | 'middle_school';

export type Language = 'en' | 'zh' | 'es' | 'tr' | 'hi' | 'fr';

export type CuisineType = 'all' | 'global' | 'chinese' | 'spanish' | 'turkish' | 'indian' | 'french';

export interface Companion {
  name: string;
  species: CompanionSpecies;
  title: string;
  level: number;
  vitality: number; // 0-100 (represents flourishing energy, not body weight)
  joy: number; // 0-100
  favoriteActivity: string;
  outfit: string;
  colorTheme: string;
}

export interface Quest {
  id: string;
  title: string;
  pillar: PillarType;
  description: string;
  whyItMatters: string;
  scientificConcept: string;
  gradeLevel: 'all' | 'elementary' | 'middle_school';
  vitalityReward: number;
  targetCount?: number;
  currentCount?: number;
  unit?: string;
  interactiveTool?: 'meal_builder' | 'movement' | 'sleep' | 'mood' | 'habit_science';
  completed: boolean;
}

export interface GardenPlant {
  id: string;
  pillar: PillarType;
  name: string;
  stage: number; // 0 (seed), 1 (sprout), 2 (bud), 3 (full bloom)
  description: string;
  benefit: string;
}

export interface Badge {
  id: string;
  name: string;
  pillar: PillarType;
  description: string;
  tier: 'bronze' | 'silver' | 'gold';
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'vegetables' | 'fruits' | 'grains' | 'protein' | 'dairy_alt' | 'hydration';
  icon: string;
  portionVisual: string;
  nutritionalHero: string; // The primary wholesome nutrient (e.g. "Dietary Fiber & Vitamin A")
  energyBenefit: string;
  middleSchoolFact: string;
  funFact: string;
  cuisine?: CuisineType;
  nativeName?: string;
  translatedNames?: Partial<Record<Language, string>>;
}

export interface BedtimeStep {
  id: string;
  title: string;
  idealOrder: number;
  icon: string;
  durationMins: number;
  why: string;
  category: 'wind_down' | 'hygiene' | 'environment' | 'mind';
}

export interface MoodEntry {
  id: string;
  timestamp: string;
  feeling: string;
  energyLevel: 'low' | 'recharging' | 'steady' | 'vibrant';
  gratitudeNote: string;
  journalPrompt?: string;
  journalResponse?: string;
}

export interface MythCard {
  id: string;
  myth: string;
  isTrue: boolean;
  fact: string;
  whyExplanation: string;
  cdcReference: string;
  category: PillarType;
}

export interface HabitLoopPreset {
  id: string;
  name: string;
  cue: string;
  oldRoutine: string;
  newHealthyRoutine: string;
  reward: string;
  scienceTip: string;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  targetCount: number;
  currentCount: number;
  unit: string;
  daysRemaining: number;
  description: string;
  participantsNote: string;
}
