import React, { useState } from 'react';
import { BedtimeStep, GradeLevel, Language } from '../types/game';
import { BEDTIME_STEPS } from '../data/wellnessData';
import { soundFx } from '../utils/audio';
import { getTranslation } from '../data/translations';
import {
  Moon,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowDown,
  ArrowUp,
  Info,
  RotateCcw,
  Zap,
  Globe,
} from 'lucide-react';

interface SleepLabProps {
  gradeLevel: GradeLevel;
  language: Language;
  onRoutineCompleted: (vitalityGained: number) => void;
}

interface CulturalSleepRitual {
  country: string;
  flag: string;
  title: string;
  nativeTitle: string;
  icon: string;
  ritual: string;
  scienceBehind: string;
}

const CULTURAL_SLEEP_RITUALS: CulturalSleepRitual[] = [
  {
    country: 'China',
    flag: '🇨🇳',
    title: 'Warm Foot Soak & Chrysanthemum Tea',
    nativeTitle: '睡前温水泡脚 (Pào Jiǎo)',
    icon: '🦶',
    ritual: 'Soaking feet in comfortably warm water for 10-15 minutes before bed.',
    scienceBehind: 'Warming the feet dilates distal blood vessels, drawing heat away from your core and causing core body temperature to drop—the primary biological trigger for deep slow-wave sleep!',
  },
  {
    country: 'Spain',
    flag: '🇪🇸',
    title: 'The Evening Breeze & Calm Balcony Reading',
    nativeTitle: 'El Sereno y la Brisa Nocturna',
    icon: '🌙',
    ritual: 'Opening the window for fresh nighttime mountain/sea air, dimming warm lamps, and quiet family reading.',
    scienceBehind: 'Cool bedroom air (around 65°F / 18°C) prevents nighttime tossing and turning, while amber light prevents blue-spectrum melatonin suppression.',
  },
  {
    country: 'Turkey',
    flag: '🇹🇷',
    title: 'Linden Herbal Infusion & Bedroom Airing',
    nativeTitle: 'Akşam Ihlamuru ve Oda Havalandırma',
    icon: '🍵',
    ritual: 'Sipping a warm cup of mild linden blossom (ıhlamur) or chamomile tea with family before brushing teeth.',
    scienceBehind: 'Linden flower antioxidants contain gentle flavonoids that soothe gastrointestinal tension and encourage parasympathetic muscle relaxation.',
  },
  {
    country: 'India',
    flag: '🇮🇳',
    title: 'Warm Turmeric Golden Milk & Shavasana',
    nativeTitle: 'हल्दी वाला दूध और शवासन (Haldi & Rest)',
    icon: '🥛',
    ritual: 'Drinking warm milk with a pinch of turmeric, followed by 5 minutes of relaxed breathing lying on your back.',
    scienceBehind: 'Warm milk contains tryptophan, an essential amino acid your brain converts into serotonin and melatonin to smoothly guide you to sleep.',
  },
  {
    country: 'France',
    flag: '🇫🇷',
    title: 'Evening Tisane & Offline Storytime',
    nativeTitle: 'La Tisane Apaisante et Lecture au Calme',
    icon: '📖',
    ritual: 'A warm herbal infusion of verbena or chamomile, accompanied by 20 minutes of reading a real paper book.',
    scienceBehind: 'Reading physical paper pages slows eye saccades and cognitive alertness from beta waves to rhythmic alpha waves, signaling sleep onset.',
  },
];

export const SleepLab: React.FC<SleepLabProps> = ({
  gradeLevel,
  language,
  onRoutineCompleted,
}) => {
  // Scramble initial steps so the student can sequence them
  const [steps, setSteps] = useState<BedtimeStep[]>([
    BEDTIME_STEPS[2],
    BEDTIME_STEPS[0],
    BEDTIME_STEPS[4],
    BEDTIME_STEPS[1],
    BEDTIME_STEPS[3],
  ]);

  const [wakeUpTime, setWakeUpTime] = useState<string>('07:00');
  const [sequenceEvaluated, setSequenceEvaluated] = useState<boolean>(false);
  const [isPerfectOrder, setIsPerfectOrder] = useState<boolean>(false);
  const [selectedRitualIdx, setSelectedRitualIdx] = useState<number>(0);

  // Move step up or down
  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    soundFx.playClick();
    const newSteps = [...steps];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSteps.length) return;

    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIdx];
    newSteps[targetIdx] = temp;

    setSteps(newSteps);
    setSequenceEvaluated(false);
  };

  const handleResetOrder = () => {
    soundFx.playClick();
    setSteps([
      BEDTIME_STEPS[2],
      BEDTIME_STEPS[0],
      BEDTIME_STEPS[4],
      BEDTIME_STEPS[1],
      BEDTIME_STEPS[3],
    ]);
    setSequenceEvaluated(false);
  };

  const handleCheckSequence = () => {
    const isCorrect = steps.every((step, idx) => step.idealOrder === idx + 1);
    setSequenceEvaluated(true);
    setIsPerfectOrder(isCorrect);

    if (isCorrect) {
      soundFx.playSuccess();
      onRoutineCompleted(25);
    } else {
      soundFx.playWaterDrop();
    }
  };

  // Calculate recommended bedtime based on 9.5 hours for growing young bodies
  const calculateBedtime = (wake: string) => {
    const [hours, minutes] = wake.split(':').map(Number);
    let bedHour = hours - 9;
    let bedMinute = minutes - 30;
    if (bedMinute < 0) {
      bedMinute += 60;
      bedHour -= 1;
    }
    if (bedHour < 0) {
      bedHour += 24;
    }
    const ampm = bedHour >= 12 ? 'PM' : 'AM';
    const displayHour = bedHour % 12 || 12;
    const displayMin = bedMinute.toString().padStart(2, '0');
    return `${displayHour}:${displayMin} ${ampm}`;
  };

  const activeRitual = CULTURAL_SLEEP_RITUALS[selectedRitualIdx];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider">
            <span>{getTranslation(language, 'appName')}</span>
            <span>·</span>
            <span>{getTranslation(language, 'sleepTitle')}</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            {getTranslation(language, 'sleepTitle')}
          </h1>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            {getTranslation(language, 'sleepSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetOrder}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'reset')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Routine Sequence Builder (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900">
                {getTranslation(language, 'bedtimeRhythm')}
              </h2>
              <p className="text-xs text-slate-500">
                {getTranslation(language, 'bedtimeDesc')}
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              5 Key Wind-Down Habits
            </span>
          </div>

          {/* Draggable / Re-orderable List */}
          <div className="space-y-2.5">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className="bg-slate-50/80 hover:bg-white rounded-xl p-3.5 border border-slate-200 hover:border-amber-300 transition-all flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-900 font-bold text-xs flex items-center justify-center font-mono">
                    #{idx + 1}
                  </div>
                  <span className="text-2xl">{step.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      {step.title}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      ~{step.durationMins} mins · {step.why}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMoveStep(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Move step earlier"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveStep(idx, 'down')}
                    disabled={idx === steps.length - 1}
                    className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Move step later"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Check Button */}
          <div className="pt-2">
            <button
              onClick={handleCheckSequence}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Moon className="w-4 h-4 fill-white" />
              <span>{getTranslation(language, 'finishRoutine')}</span>
            </button>

            {sequenceEvaluated && (
              <div
                className={`mt-3 p-3 rounded-xl border text-xs flex items-start gap-2 ${
                  isPerfectOrder
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-amber-50 border-amber-300 text-amber-900'
                }`}
              >
                {isPerfectOrder ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Master Sleep Architect!</strong> Your routine gracefully winds down from digital screen sunset to soothing dim light, dental hygiene, paper book reading, and calm pillow breathing. (+25 Seeds Earned!)
                    </div>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Almost there!</strong> Think about setting devices aside first before reading or turning down lights. Keep arranging until you find the gentlest transition into sleep!
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Circadian Clock & Global Rest Traditions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Circadian Calculator */}
          <div className="bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Circadian Sleep Rhythm Calculator</span>
            </h3>

            <p className="text-xs text-slate-600">
              Students ages 8–14 thrive on <strong>9 to 11 hours</strong> of restorative sleep for memory consolidation and growth hormone release.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                What time do you need to wake up for school?
              </label>
              <input
                type="time"
                value={wakeUpTime}
                onChange={(e) => setWakeUpTime(e.target.value)}
                className="w-full text-base font-mono font-bold px-3 py-2 border border-slate-300 rounded-lg bg-white"
              />

              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 text-xs text-indigo-900 space-y-1">
                <div className="font-semibold">Target Ideal Lights-Out:</div>
                <div className="text-lg font-bold font-mono text-indigo-700">
                  {calculateBedtime(wakeUpTime)}
                </div>
                <div className="text-[11px] text-indigo-800/80">
                  Allows 9.5 hours of uninterrupted sleep cycles + 30 mins to drift off peacefully.
                </div>
              </div>
            </div>
          </div>

          {/* Global Rest & Sleep Traditions Card */}
          <div className="bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Global Rest Traditions</span>
              </h3>
              <span className="text-xs text-slate-400">Tap country</span>
            </div>

            {/* Country Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CULTURAL_SLEEP_RITUALS.map((ritual, idx) => (
                <button
                  key={ritual.country}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedRitualIdx(idx);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1 ${
                    selectedRitualIdx === idx
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{ritual.flag}</span>
                  <span>{ritual.country}</span>
                </button>
              ))}
            </div>

            {/* Selected Ritual Content */}
            <div className="bg-amber-50/60 rounded-xl p-3.5 border border-amber-200/60 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeRitual.icon}</span>
                <div>
                  <h4 className="font-bold text-slate-900">{activeRitual.title}</h4>
                  <p className="text-[11px] text-amber-900 font-medium italic">{activeRitual.nativeTitle}</p>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed">{activeRitual.ritual}</p>
              <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200/50 text-[11px] text-slate-600">
                <strong>Why it works:</strong> {activeRitual.scienceBehind}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
