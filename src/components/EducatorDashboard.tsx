import React, { useState } from 'react';
import { GradeLevel, Language } from '../types/game';
import { getTranslation } from '../data/translations';
import {
  GraduationCap,
  ShieldCheck,
  HeartHandshake,
  Users,
  CheckCircle2,
  FileText,
  Lock,
  Sparkles,
  BarChart3,
  BookOpen,
} from 'lucide-react';

interface EducatorDashboardProps {
  gradeLevel: GradeLevel;
  language: Language;
}

export const EducatorDashboard: React.FC<EducatorDashboardProps> = ({
  gradeLevel,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'family_prompts'>('overview');

  // Privacy-conscious aggregate participation stats (zero individual comparison or body data)
  const aggregateMetrics = [
    { pillar: 'Nutrition & Hydration', rate: 88, highlight: 'High water tracking and whole fruit exploration' },
    { pillar: 'Joyful Physical Play', rate: 82, highlight: 'Daily 2-minute stretch breaks and active recesses' },
    { pillar: 'Sleep & Wind-Down', rate: 79, highlight: 'Evening screen sunset routines practiced consistently' },
    { pillar: 'Hygiene (Teeth & Hands)', rate: 94, highlight: 'Consistent 2-minute brushing timer engagement' },
    { pillar: 'Emotional Mindfulness', rate: 86, highlight: 'Regular mood check-ins & gratitude wall participation' },
  ];

  const standardsAlignments = [
    {
      code: 'NHES Standard 1',
      title: 'Comprehending Concepts Related to Health Promotion',
      detail: 'Students understand the relationship between healthy behaviors (balanced food groups, sleep architecture, hydration) and personal well-being.',
    },
    {
      code: 'NHES Standard 6',
      title: 'Goal-Setting & Habit Formation',
      detail: 'Students learn cue-routine-reward architecture and practice incremental habit goal setting with non-punitive streak shields.',
    },
    {
      code: 'CASEL SEL Core',
      title: 'Self-Awareness & Self-Management',
      detail: 'Students recognize internal emotional states, calibrate energy levels, and utilize somatic box-breathing to regulate acute stress.',
    },
    {
      code: 'CDC Healthy Schools',
      title: 'Whole School, Whole Community, Whole Child (WSCC)',
      detail: 'Promotes nutrition environments free of body-shaming or calorie-fixation, fostering lifelong positive self-image.',
    },
  ];

  const familyDiscussionTopics = [
    {
      title: '1. The "Screen Sunset" Family Ritual',
      question: 'Can we create a shared charging basket in the hallway where all family phones sleep at 8:30 PM?',
      tip: 'When adults model putting devices away, youth naturally adopt calm reading and conversation before bed.',
    },
    {
      title: '2. The Color-on-the-Plate Adventure',
      question: 'What is one new colorful fruit or vegetable from the grocery store we can taste test together this week?',
      tip: 'Focus on flavor, crunch, and curiosity rather than forcing clean plates.',
    },
    {
      title: '3. Gentle Reset Over Perfection',
      question: 'When a busy day throws off our habits, what is one kind thing we can say to ourselves instead of feeling guilty?',
      tip: 'Teach children that habits are like learning an instrument: missed notes are part of practicing.',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <span>Educator & Family Portal</span>
            <span>·</span>
            <span>Privacy-First Health Education</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            Educator & Caregiver Wellness Dashboard
          </h1>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Support your students with evidence-based health habits. Compliant with COPPA and school privacy standards: zero student body metrics, zero weight tracking, and strictly non-competitive aggregate participation.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Classroom Overview
          </button>
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'curriculum'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Standards Alignment
          </button>
          <button
            onClick={() => setActiveTab('family_prompts')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'family_prompts'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Family Discussion Kit
          </button>
        </div>
      </div>

      {/* Privacy Guarantee Strip */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>COPPA & Student Privacy Certified:</strong> All data is stored client-side. No personally identifiable health data, weight, or individual leaderboard ranks are ever collected or exposed.
          </span>
        </div>
        <div className="text-[11px] font-semibold text-emerald-800 shrink-0 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200">
          Strict Anti-Diet-Culture Standard
        </div>
      </div>

      {activeTab === 'overview' ? (
        /* Classroom & Group Overview */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Aggregate Participation Rates (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>Weekly Group Participation by Health Pillar</span>
              </h3>
              <span className="text-xs text-slate-500">24 Active Students (Aggregate)</span>
            </div>

            <div className="space-y-4">
              {aggregateMetrics.map((item) => (
                <div key={item.pillar} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{item.pillar}</span>
                    <span className="text-emerald-800 font-mono tabular-nums">{item.rate}% Participation</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">{item.highlight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Guidance & Non-Judgmental Framing (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-amber-600" />
                <span>Pedagogical Principles</span>
              </h3>

              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <strong className="text-slate-900 block mb-0.5">Focus on Habits, Not Outcomes:</strong>
                  Praise behaviors within a child’s direct agency (choosing water, stretching, reading before bed) rather than biological outcomes.
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <strong className="text-slate-900 block mb-0.5">Gentle Recovery Mechanics:</strong>
                  When a student misses a habit quest, frame it as normal rest. The "Gentle Streak Shield" teaches resilient continuation over perfectionist burnout.
                </div>

                <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
                  <strong className="text-slate-900 block mb-0.5">Curiosity Over Scolding:</strong>
                  Instead of asking "Why didn't you do this?", ask "What made it tricky today? How can we make the healthy choice easier to reach?"
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
              Curriculum Mode Active: <strong className="text-slate-800 capitalize">{gradeLevel.replace('_', ' ')} (Ages {gradeLevel === 'elementary' ? '8–10' : '11–14'})</strong>
            </div>
          </div>
        </div>
      ) : activeTab === 'curriculum' ? (
        /* Standards Alignment View */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              <span>National Health Education Standards (NHES) & CASEL SEL Alignment</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {standardsAlignments.map((std) => (
                <div
                  key={std.code}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5"
                >
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    {std.code}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{std.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{std.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Family Discussion Kit View */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <span>Family Wellness Conversation Starters</span>
              </h3>
              <span className="text-xs text-slate-500">Weekly Dinner & Carpool Prompts</span>
            </div>

            <div className="space-y-3">
              {familyDiscussionTopics.map((topic, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-amber-200/70 bg-amber-50/40 space-y-2"
                >
                  <h4 className="text-sm font-bold text-slate-900">{topic.title}</h4>
                  <p className="text-xs font-medium text-amber-950 bg-white/80 p-2.5 rounded-lg border border-amber-200/50">
                    🗣️ "{topic.question}"
                  </p>
                  <p className="text-xs text-slate-600">{topic.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
