import React, { useState, useEffect } from 'react';
import { GradeLevel, Language } from '../types/game';
import { soundFx } from '../utils/audio';
import { getTranslation } from '../data/translations';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Footprints,
  CheckCircle2,
  Heart,
  Globe,
  Info,
} from 'lucide-react';

interface MovementStudioProps {
  gradeLevel: GradeLevel;
  language: Language;
  onActivityComplete: (vitalityGained: number) => void;
}

interface StretchExercise {
  id: string;
  name: string;
  category: 'Spinal Mobility' | 'Upper Body' | 'Balance & Core' | 'Aerobic Spark';
  durationSeconds: number;
  icon: string;
  instructions: string;
  whyItMatters: string;
  middleSchoolFact: string;
}

interface CulturalMovement {
  id: string;
  culture: string;
  flag: string;
  title: string;
  nativeTitle: string;
  durationSeconds: number;
  icon: string;
  technique: string;
  benefit: string;
  funFact: string;
}

const EXERCISES: StretchExercise[] = [
  {
    id: 'stretch_reach_stars',
    name: 'Reach for the Stars & Sky',
    category: 'Spinal Mobility',
    durationSeconds: 20,
    icon: '✨',
    instructions: 'Stand tall with feet hip-width apart. Inhale deeply and reach both arms toward the sky, gently elongating your spine. Wiggle fingers at the top!',
    whyItMatters: 'Decompresses spinal discs after hours of sitting in school chairs and stretches the intercostal breathing muscles.',
    middleSchoolFact: 'Increases thoracic cavity volume, allowing deeper diaphragm contractions and better oxygen exchange in alveoli.',
  },
  {
    id: 'stretch_shoulder_rolls',
    name: 'Shoulder Wave Unwind',
    category: 'Upper Body',
    durationSeconds: 20,
    icon: '🌊',
    instructions: 'Roll shoulders up towards your ears, backward, and gently down. Breathe out smoothly. Repeat 5 times forward and 5 times backward.',
    whyItMatters: 'Relieves trapezius and neck tightness often caused by reading or carrying a school backpack.',
    middleSchoolFact: 'Stimulates venous blood drainage from neck muscles and reduces tension headaches.',
  },
  {
    id: 'stretch_tree_balance',
    name: 'Gentle Tree Pose Balance',
    category: 'Balance & Core',
    durationSeconds: 20,
    icon: '🌳',
    instructions: 'Shift weight to your right foot. Place left foot against your ankle or calf (not knee). Hands together at your heart. Focus on a still spot ahead!',
    whyItMatters: 'Trains vestibular balance, ankle stability, and centers mental focus.',
    middleSchoolFact: 'Engages cerebellar pathways and activates deep proprioceptors in the ankle joint ligaments.',
  },
  {
    id: 'stretch_star_bursts',
    name: 'Playful Star Power Hops',
    category: 'Aerobic Spark',
    durationSeconds: 20,
    icon: '⭐',
    instructions: 'Gently hop or step wide with arms out like a glowing star, then step back together. Light on your feet, smiling!',
    whyItMatters: 'Wakes up your cardiovascular system and releases uplifting endorphins.',
    middleSchoolFact: 'Brief bursts of weight-bearing impact stimulate osteoblasts to deposit new bone mineral matrix.',
  },
];

const CULTURAL_MOVEMENTS: CulturalMovement[] = [
  {
    id: 'move_china_taichi',
    culture: 'Chinese Tradition',
    flag: '🇨🇳',
    title: 'Tai Chi: Wave Hands Like Clouds',
    nativeTitle: '太极·行云流水 (Yún Shǒu)',
    durationSeconds: 30,
    icon: '🥋',
    technique: 'Stand with soft knees. Slowly rotate your torso from side to side while floating one palm at face level and the other across the navel, switching gently like drifting clouds.',
    benefit: 'Integrates mindful breathing with gentle rotational spinal mobility, relaxing the autonomic nervous system.',
    funFact: 'Tai Chi was created hundreds of years ago in China as an "internal martial art" focused on balance, harmony, and graceful continuous flow.',
  },
  {
    id: 'move_india_yoga',
    culture: 'Indian Tradition',
    flag: '🇮🇳',
    title: 'Yoga: Sun Greeting & Mountain',
    nativeTitle: 'सूर्य नमस्कार व ताड़ासन (Yoga Flow)',
    durationSeconds: 30,
    icon: '🧘',
    technique: 'Inhale deeply as arms arc overhead like the rising morning sun. Exhale and bow forward with soft knees, then slowly roll spine up bone-by-bone into a strong mountain pose.',
    benefit: 'Lengthens hamstrings, awakens spinal erectors, and coordinates lung capacity with movement.',
    funFact: 'Yoga has been practiced in India for over 5,000 years to harmonize the physical body (Sharira), breath (Prana), and mind (Manas)!',
  },
  {
    id: 'move_spain_flamenco',
    culture: 'Spanish Tradition',
    flag: '🇪🇸',
    title: 'Flamenco: Rhythm Clap & Step',
    nativeTitle: 'Compás de Palmas y Taconeo (Flamenco)',
    durationSeconds: 30,
    icon: '💃',
    technique: 'Lift your chest and shoulders high. Clap rhythmically: 1-2-3, 1-2-3! Alternate tapping toes and heels to the steady beat while keeping arms curved gracefully.',
    benefit: 'Sharpens auditory-motor coordination, builds calf muscle endurance, and improves posture pride.',
    funFact: 'Flamenco claps are called "palmas sordas" (soft cupped claps) and "palmas claras" (sharp ringing claps) to set the lively tempo!',
  },
  {
    id: 'move_turkey_halay',
    culture: 'Turkish Tradition',
    flag: '🇹🇷',
    title: 'Anatolian Rhythm: Folk Bounce & Shoulder Waves',
    nativeTitle: 'Anadolu Halk Oyunları Ritmi (Halay)',
    durationSeconds: 30,
    icon: '🕺',
    technique: 'Stand in place with light spring in your knees. Step right-together, left-together, bouncing your shoulders up and down gently to an upbeat celebratory rhythm!',
    benefit: 'Enhances ankle springiness, shakes off shoulder stress, and fosters collective joy.',
    funFact: 'In Anatolian folk dances like Halay and Horon, people link little fingers or shoulders to celebrate community unity, harvest, and festivities!',
  },
  {
    id: 'move_france_promenade',
    culture: 'French Tradition',
    flag: '🇫🇷',
    title: 'Promenade: Active Posture Walk',
    nativeTitle: 'La Promenade Active du Parc',
    durationSeconds: 30,
    icon: '🚶',
    technique: 'Walk briskly with an elongated neck, swinging arms naturally from the shoulders, breathing in crisp air for 4 paces and exhaling smoothly for 4 paces.',
    benefit: 'Activates gluteal muscles and deep core stabilizers while oxygenating brain circuits.',
    funFact: 'In France, "la promenade" is a cherished daily custom where families and students take active evening walks through tree-lined gardens to unwind!',
  },
];

export const MovementStudio: React.FC<MovementStudioProps> = ({
  gradeLevel,
  language,
  onActivityComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'guided_stretch' | 'cultural' | 'step_journey'>('guided_stretch');

  // Guided Stretch State
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(EXERCISES[0].durationSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [routineCompleted, setRoutineCompleted] = useState<boolean>(false);

  // Cultural Movement State
  const [culturalIdx, setCulturalIdx] = useState<number>(0);
  const [culturalTimer, setCulturalTimer] = useState<number>(CULTURAL_MOVEMENTS[0].durationSeconds);
  const [culturalRunning, setCulturalRunning] = useState<boolean>(false);
  const [culturalCompleted, setCulturalCompleted] = useState<boolean>(false);

  // Step Journey Game State
  const [stepPace, setStepPace] = useState<number>(0);
  const [virtualSteps, setVirtualSteps] = useState<number>(1450);
  const [realStepInput, setRealStepInput] = useState<string>('');
  const [stepLoggedSuccess, setStepLoggedSuccess] = useState<boolean>(false);

  const currentExercise = EXERCISES[currentExerciseIdx];
  const currentCultural = CULTURAL_MOVEMENTS[culturalIdx];

  // Timer loop for stretch break
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            soundFx.playSuccess();
            if (currentExerciseIdx < EXERCISES.length - 1) {
              const nextIdx = currentExerciseIdx + 1;
              setCurrentExerciseIdx(nextIdx);
              return EXERCISES[nextIdx].durationSeconds;
            } else {
              setIsRunning(false);
              setRoutineCompleted(true);
              onActivityComplete(25);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsRemaining, currentExerciseIdx, onActivityComplete]);

  // Timer loop for cultural movement
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (culturalRunning && culturalTimer > 0) {
      interval = setInterval(() => {
        setCulturalTimer((prev) => {
          if (prev <= 1) {
            soundFx.playSuccess();
            setCulturalRunning(false);
            setCulturalCompleted(true);
            onActivityComplete(25);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [culturalRunning, culturalTimer, onActivityComplete]);

  const handleStartPause = () => {
    soundFx.playClick();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    soundFx.playClick();
    setIsRunning(false);
    setCurrentExerciseIdx(0);
    setSecondsRemaining(EXERCISES[0].durationSeconds);
    setRoutineCompleted(false);
  };

  const handleAddVirtualSteps = (count: number) => {
    soundFx.playWaterDrop();
    setVirtualSteps((prev) => prev + count);
    setStepPace(count);
    setTimeout(() => setStepPace(0), 1000);
  };

  const handleLogRealSteps = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(realStepInput, 10);
    if (isNaN(val) || val <= 0) return;
    soundFx.playSuccess();
    setVirtualSteps((prev) => prev + val);
    setStepLoggedSuccess(true);
    onActivityComplete(20);
    setTimeout(() => {
      setStepLoggedSuccess(false);
      setRealStepInput('');
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <span>{getTranslation(language, 'appName')}</span>
            <span>·</span>
            <span>{getTranslation(language, 'movementTitle')}</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            {getTranslation(language, 'movementTitle')}
          </h1>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            {getTranslation(language, 'movementSubtitle')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('guided_stretch');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'guided_stretch'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {getTranslation(language, 'tabStretches')}
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('cultural');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'cultural'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{getTranslation(language, 'tabCulturalMoves')}</span>
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('step_journey');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'step_journey'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {getTranslation(language, 'tabStepJourney')}
          </button>
        </div>
      </div>

      {/* Tab 1: Guided Desk Stretch Breaks */}
      {activeTab === 'guided_stretch' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Stretch Stage (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Exercise {currentExerciseIdx + 1} of {EXERCISES.length} · {currentExercise.category}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {secondsRemaining}s remaining
                </span>
              </div>

              {/* Central Exercise Visual Card */}
              <div className="bg-amber-50/50 rounded-2xl p-6 sm:p-8 border border-amber-200/60 text-center flex flex-col items-center justify-center space-y-3 min-h-[220px]">
                <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-4xl mb-1">
                  {currentExercise.icon}
                </div>
                <h3 className="text-xl font-bold font-display text-slate-900">
                  {currentExercise.name}
                </h3>
                <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                  {currentExercise.instructions}
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{
                    width: `${((currentExerciseIdx + 1) / EXERCISES.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{getTranslation(language, 'reset')}</span>
              </button>

              {routineCompleted ? (
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Stretch Flow Complete! (+25 Seeds Earned)</span>
                </div>
              ) : (
                <button
                  onClick={handleStartPause}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>{getTranslation(language, 'stopRoutine')}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>{getTranslation(language, 'startRoutine')}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Educational Movement Why Panel (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>{getTranslation(language, 'whyItMatters')}</span>
              </h3>

              <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/60 text-xs text-slate-700 space-y-2">
                <div className="font-semibold text-slate-900">Physiology & Flexibility:</div>
                <p className="leading-relaxed">{currentExercise.whyItMatters}</p>
              </div>

              <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200/60 text-xs text-slate-700 space-y-2">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{getTranslation(language, 'scienceConcept')}</span>
                </div>
                <p className="leading-relaxed">
                  {gradeLevel === 'middle_school'
                    ? currentExercise.middleSchoolFact
                    : 'Movement pumps oxygen-rich blood directly to your brain cells, boosting focus for tests, puzzles, and reading!'}
                </p>
              </div>
            </div>

            {/* List of routine items */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 mb-2">
                Routine Sequence:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {EXERCISES.map((ex, idx) => (
                  <div
                    key={ex.id}
                    onClick={() => {
                      soundFx.playClick();
                      setCurrentExerciseIdx(idx);
                      setSecondsRemaining(ex.durationSeconds);
                    }}
                    className={`p-2 rounded-lg text-[11px] border cursor-pointer transition-colors flex items-center gap-2 ${
                      idx === currentExerciseIdx
                        ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-950'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{ex.icon}</span>
                    <span className="truncate">{ex.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Global Cultural Movements */}
      {activeTab === 'cultural' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {CULTURAL_MOVEMENTS.map((cm, idx) => (
              <button
                key={cm.id}
                onClick={() => {
                  soundFx.playClick();
                  setCulturalIdx(idx);
                  setCulturalTimer(cm.durationSeconds);
                  setCulturalRunning(false);
                  setCulturalCompleted(false);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  culturalIdx === idx
                    ? 'bg-amber-100/70 border-amber-400 font-bold shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-lg mb-1">
                  <span>{cm.flag}</span>
                  <span>{cm.icon}</span>
                </div>
                <div className="text-xs text-slate-900 font-display truncate">{cm.culture}</div>
                <div className="text-[10px] text-slate-500 truncate">{cm.nativeTitle.split(' ')[0]}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                    <span>{currentCultural.flag}</span>
                    <span>{currentCultural.culture}</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {culturalTimer}s flow
                  </span>
                </div>

                <div className="bg-amber-50/50 rounded-2xl p-6 sm:p-8 border border-amber-200/60 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-4xl mb-1">
                    {currentCultural.icon}
                  </div>
                  <h3 className="text-xl font-bold font-display text-slate-900">
                    {currentCultural.title}
                  </h3>
                  <p className="text-xs text-amber-900/80 font-medium">
                    {currentCultural.nativeTitle}
                  </p>
                  <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                    {currentCultural.technique}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setCulturalTimer(currentCultural.durationSeconds);
                    setCulturalRunning(false);
                    setCulturalCompleted(false);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{getTranslation(language, 'reset')}</span>
                </button>

                {culturalCompleted ? (
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Global Movement Completed! (+25 Seeds)</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setCulturalRunning(!culturalRunning);
                    }}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {culturalRunning ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>{getTranslation(language, 'stopRoutine')}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>Practice Cultural Movement</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Cultural Health Wisdom</span>
              </h3>

              <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200/60 text-xs text-slate-700 space-y-2">
                <div className="font-semibold text-slate-900">Anatomical & Nervous System Benefit:</div>
                <p className="leading-relaxed">{currentCultural.benefit}</p>
              </div>

              <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/60 text-xs text-slate-700 space-y-2">
                <div className="font-semibold text-slate-900">Cultural & Historical Heritage:</div>
                <p className="leading-relaxed">{currentCultural.funFact}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Daily Step Journey & Physical Play Explorer */}
      {activeTab === 'step_journey' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold font-display text-slate-900 mb-1">
                Kinetic Step Counter & Trail Explorer
              </h3>
              <p className="text-xs text-slate-600">
                Whether you walked the dog, played tag at recess, or jogged in place during a commercial, every step powers your journey!
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white text-center space-y-3 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-center gap-2 text-emerald-100 text-xs uppercase tracking-wider font-semibold">
                <Footprints className="w-4 h-4" />
                <span>{getTranslation(language, 'stepsLogged')}</span>
              </div>

              <div className="text-5xl font-extrabold font-mono tabular-nums tracking-tight">
                {virtualSteps.toLocaleString()}
              </div>

              <div className="text-xs text-emerald-100/90 font-medium">
                Goal: 6,000 Joyful Play Steps · {Math.min(100, Math.round((virtualSteps / 6000) * 100))}% of Daily Adventure!
              </div>

              <div className="w-full bg-emerald-950/40 rounded-full h-2 overflow-hidden mt-2">
                <div
                  className="bg-amber-300 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (virtualSteps / 6000) * 100)}%` }}
                />
              </div>

              {stepPace > 0 && (
                <div className="inline-block text-xs font-bold text-amber-200 bg-black/20 px-3 py-1 rounded-full animate-bounce">
                  +{stepPace} Steps Added!
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAddVirtualSteps(250)}
                className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>👟</span>
                <span>+250 Steps</span>
              </button>
              <button
                onClick={() => handleAddVirtualSteps(500)}
                className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🏃</span>
                <span>+500 Steps</span>
              </button>
              <button
                onClick={() => handleAddVirtualSteps(1000)}
                className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🌟</span>
                <span>+1000 Steps</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Log Real-Life Steps or Playtime</span>
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                Have a pedometer, watch, or family walk estimate? Log your real-life steps here to reward your companion!
              </p>

              <form onSubmit={handleLogRealSteps} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enter Step Count:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50000"
                    placeholder="e.g. 2500"
                    value={realStepInput}
                    onChange={(e) => setRealStepInput(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!realStepInput}
                  className="w-full py-2 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer disabled:opacity-40"
                >
                  {getTranslation(language, 'submit')}
                </button>

                {stepLoggedSuccess && (
                  <div className="text-center text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    Awesome job moving today! (+20 Seeds Earned)
                  </div>
                )}
              </form>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Active Play Guideline:</strong> CDC recommends young people engage in at least 60 minutes of enjoyable physical movement every day!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
