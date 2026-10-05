import React, { useState } from 'react';
import { Badge, Companion, Language } from '../types/game';
import { soundFx } from '../utils/audio';
import { getTranslation } from '../data/translations';
import {
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
  Droplet,
  Utensils,
  Moon,
  Activity,
  Heart,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

interface AchievementsProps {
  badges: Badge[];
  setBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
  companion: Companion;
  setCompanion: React.Dispatch<React.SetStateAction<Companion>>;
  vitalitySeeds: number;
  setVitalitySeeds: React.Dispatch<React.SetStateAction<number>>;
  language: Language;
}

interface CustomizationItem {
  id: string;
  name: string;
  category: 'outfit' | 'habitat';
  icon: string;
  cost: number;
  description: string;
  unlocked: boolean;
  equipped: boolean;
}

const INITIAL_SHOP_ITEMS: CustomizationItem[] = [
  {
    id: 'outfit_scarf',
    name: 'Cozy Knitted Scarf',
    category: 'outfit',
    icon: '🧣',
    cost: 40,
    description: 'A hand-woven emerald and cream scarf to keep your companion warm during brisk outdoor walks.',
    unlocked: true,
    equipped: true,
  },
  {
    id: 'outfit_hat',
    name: 'Explorer Cap',
    category: 'outfit',
    icon: '🧢',
    cost: 60,
    description: 'A breezy cotton cap for sunny playground walks and nature explorations.',
    unlocked: false,
    equipped: false,
  },
  {
    id: 'outfit_glasses',
    name: 'Scholar Glasses',
    category: 'outfit',
    icon: '👓',
    cost: 80,
    description: 'Tortoiseshell spectacles that celebrate curiosity, reading, and learning habit science.',
    unlocked: false,
    equipped: false,
  },
  {
    id: 'habitat_lantern',
    name: 'Amber Garden Lantern',
    category: 'habitat',
    icon: '🏮',
    cost: 50,
    description: 'A gentle glowing lantern that illuminates the habit garden path at sunset.',
    unlocked: true,
    equipped: true,
  },
  {
    id: 'habitat_bench',
    name: 'Cedar Reading Nook',
    category: 'habitat',
    icon: '🛋️',
    cost: 90,
    description: 'A comfortable bench beneath the apple trees for calm journaling and breathing.',
    unlocked: false,
    equipped: false,
  },
  {
    id: 'habitat_fountain',
    name: 'Bubbling Stream Fountain',
    category: 'habitat',
    icon: '⛲',
    cost: 110,
    description: 'A soothing stone fountain celebrating daily clean water and hydration.',
    unlocked: false,
    equipped: false,
  },
];

export const Achievements: React.FC<AchievementsProps> = ({
  badges,
  companion,
  setCompanion,
  vitalitySeeds,
  setVitalitySeeds,
  language,
}) => {
  const [shopItems, setShopItems] = useState<CustomizationItem[]>(INITIAL_SHOP_ITEMS);
  const [activeTab, setActiveTab] = useState<'badges' | 'wardrobe'>('badges');

  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplet':
        return <Droplet className="w-5 h-5 text-sky-500" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-emerald-500" />;
      case 'Moon':
        return <Moon className="w-5 h-5 text-indigo-500" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-amber-500" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-rose-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-purple-500" />;
      default:
        return <Award className="w-5 h-5 text-amber-500" />;
    }
  };

  const handleUnlockItem = (item: CustomizationItem) => {
    if (vitalitySeeds < item.cost) {
      soundFx.playClick();
      return;
    }
    soundFx.playBadgeUnlock();
    setVitalitySeeds((prev) => prev - item.cost);
    setShopItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, unlocked: true, equipped: true } : i))
    );
    if (item.category === 'outfit') {
      setCompanion((c) => ({ ...c, outfit: item.id }));
    }
  };

  const handleEquipItem = (item: CustomizationItem) => {
    soundFx.playClick();
    setShopItems((prev) =>
      prev.map((i) => {
        if (i.category === item.category) {
          return { ...i, equipped: i.id === item.id ? !i.equipped : false };
        }
        return i;
      })
    );
    if (item.category === 'outfit') {
      setCompanion((c) => ({ ...c, outfit: c.outfit === item.id ? 'none' : item.id }));
    }
  };

  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <span>Growth & Milestone Gallery</span>
            <span>·</span>
            <span>Earned Through Practice</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            Wellness Achievements & Sanctuary Shop
          </h1>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Every badge and decoration here is earned purely through healthy daily consistency—no money, no paywalls. Celebrate your journey!
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('badges');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'badges'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tiered Badges ({unlockedBadgesCount}/{badges.length})
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('wardrobe');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'wardrobe'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sanctuary Customization
          </button>
        </div>
      </div>

      {activeTab === 'badges' ? (
        /* Badges View */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Featured Trophy Card (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col justify-between text-center space-y-4">
            <div>
              <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden border-2 border-amber-200 shadow-md mb-3">
                <img
                  src="/src/assets/images/badge_wellness_trophy_1790230899833.jpg"
                  alt="Wellness Achievement Badge"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h3 className="text-lg font-bold text-slate-900 font-display">
                Wellness Explorer Crest
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Unlocked: <span className="font-bold text-emerald-700">{unlockedBadgesCount}</span> of{' '}
                <span className="font-bold text-slate-800">{badges.length}</span> Milestones
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 text-left space-y-1">
              <div className="font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Habit Philosophy:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Badges reward returning to your habits again and again. Even on busy or challenging days, taking one slow breath or sipping one glass of water keeps your neural circuits alive!
              </p>
            </div>
          </div>

          {/* Badges Grid (8 cols) */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((badge) => {
              const progressPct = Math.round((badge.progress / badge.maxProgress) * 100);

              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    badge.unlocked
                      ? 'bg-white border-amber-200 shadow-xs hover:border-amber-400'
                      : 'bg-slate-50/60 border-slate-200 opacity-80'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            badge.unlocked
                              ? 'bg-amber-100/70 border border-amber-300'
                              : 'bg-slate-200 border border-slate-300'
                          }`}
                        >
                          {badge.unlocked ? (
                            renderBadgeIcon(badge.iconName)
                          ) : (
                            <Lock className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 font-display">
                            {badge.name}
                          </h4>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            {badge.tier} Tier · {badge.pillar}
                          </span>
                        </div>
                      </div>

                      {badge.unlocked && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                      <span>{badge.unlocked ? 'Mastered!' : 'In Progress'}</span>
                      <span className="font-mono tabular-nums">
                        {badge.progress}/{badge.maxProgress}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          badge.unlocked ? 'bg-amber-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Sanctuary Customization Wardrobe View */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Sanctuary & Companion Customization
                </h3>
              </div>
              <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                Available: {vitalitySeeds} Vitality Seeds
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shopItems.map((item) => {
                const canAfford = vitalitySeeds >= item.cost;

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-300 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-start justify-between">
                        <span className="text-3xl">{item.icon}</span>
                        <span className="text-xs font-bold text-emerald-800 font-mono">
                          {item.unlocked ? 'Owned' : `${item.cost} Seeds`}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                      <p className="text-xs text-slate-500 leading-snug">{item.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      {item.unlocked ? (
                        <button
                          onClick={() => handleEquipItem(item)}
                          className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            item.equipped
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {item.equipped ? 'Equipped ✓' : 'Equip in Sanctuary'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnlockItem(item)}
                          disabled={!canAfford}
                          className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            canAfford
                              ? 'bg-amber-500 hover:bg-amber-600 text-white'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {canAfford ? `Unlock for ${item.cost} Seeds` : `Need ${item.cost - vitalitySeeds} more Seeds`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
