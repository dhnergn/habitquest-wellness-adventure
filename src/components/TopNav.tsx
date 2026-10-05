import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Sprout, Globe, ChevronDown, Check } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { GradeLevel, Language } from '../types/game';
import { SUPPORTED_LANGUAGES, getTranslation } from '../data/translations';

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  gradeLevel: GradeLevel;
  setGradeLevel: (level: GradeLevel) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  vitalitySeeds: number;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  gradeLevel,
  setGradeLevel,
  soundEnabled,
  setSoundEnabled,
  vitalitySeeds,
  language,
  setLanguage,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close language menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSound = () => {
    soundFx.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      soundFx.playClick();
    }
  };

  const navLinks = [
    { id: 'sanctuary', label: getTranslation(language, 'navSanctuary') },
    { id: 'meal_builder', label: getTranslation(language, 'navMealBuilder') },
    { id: 'movement', label: getTranslation(language, 'navMovement') },
    { id: 'sleep', label: getTranslation(language, 'navSleep') },
    { id: 'mind_mood', label: getTranslation(language, 'navMindMood') },
    { id: 'habit_science', label: getTranslation(language, 'navHabitScience') },
    { id: 'badges', label: getTranslation(language, 'navBadges') },
    { id: 'educator', label: getTranslation(language, 'navEducator') },
  ];

  const handleNavClick = (id: string) => {
    soundFx.playClick();
    setActiveTab(id);
  };

  const currentLangInfo = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => handleNavClick('sanctuary')}
          className="flex items-center gap-2 text-left group focus:outline-hidden cursor-pointer"
          aria-label="HabitQuest Home"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-700 transition-colors">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 font-display">
            {getTranslation(language, 'appName')}
          </span>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-600">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-100/80 text-amber-950 font-semibold shadow-xs'
                    : 'hover:text-slate-950 hover:bg-amber-50/70'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Language, Grade level, Sound, Seeds) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => {
                soundFx.playClick();
                setLangMenuOpen(!langMenuOpen);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Change Language / Options (English, 中文, Español, Türkçe, हिन्दी, Français)"
              aria-expanded={langMenuOpen}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-sm leading-none">{currentLangInfo.flag}</span>
              <span className="hidden sm:inline">{currentLangInfo.nativeName}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  {getTranslation(language, 'languageSelector')}
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        soundFx.playSuccess();
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-amber-50/80 transition-colors cursor-pointer ${
                        isSelected ? 'bg-amber-50 text-amber-950 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{lang.flag}</span>
                        <div>
                          <p className="leading-tight">{lang.nativeName}</p>
                          <p className="text-[10px] text-slate-400 font-normal">{lang.name}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Grade Level Selector */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-medium border border-slate-200">
            <button
              onClick={() => {
                soundFx.playClick();
                setGradeLevel('elementary');
              }}
              className={`px-2.5 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                gradeLevel === 'elementary'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Ages 8-10: Elementary Health Focus"
            >
              {getTranslation(language, 'ageElementary')}
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setGradeLevel('middle_school');
              }}
              className={`px-2.5 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                gradeLevel === 'middle_school'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Ages 11-14: Middle School Health Science"
            >
              {getTranslation(language, 'ageMiddle')}
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title={soundEnabled ? getTranslation(language, 'soundOn') : getTranslation(language, 'soundOff')}
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Vitality Seeds Currency */}
          <div
            className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 px-2.5 sm:px-3 py-1.5 rounded-lg text-emerald-900"
            title="Vitality Seeds earned through healthy consistent habits"
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
            <span className="text-xs font-bold font-mono tabular-nums">{vitalitySeeds}</span>
            <span className="text-xs font-medium text-emerald-800 hidden sm:inline">
              {getTranslation(language, 'seedsLabel')}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile navigation bar scrollable row */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto border-t border-slate-100 bg-white scrollbar-none">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-amber-100/90 text-amber-950 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
