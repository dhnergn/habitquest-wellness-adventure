import React, { useState } from 'react';
import { FoodItem, GradeLevel, Language, CuisineType } from '../types/game';
import { FOOD_DATABASE } from '../data/wellnessData';
import { soundFx } from '../utils/audio';
import { getTranslation } from '../data/translations';
import {
  Utensils,
  Sparkles,
  Info,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Search,
  HeartHandshake,
  Globe2,
} from 'lucide-react';

interface MealBuilderProps {
  gradeLevel: GradeLevel;
  language: Language;
  onMealComplete: (vitalityGained: number) => void;
}

export const MealBuilder: React.FC<MealBuilderProps> = ({
  gradeLevel,
  language,
  onMealComplete,
}) => {
  const [plateFoods, setPlateFoods] = useState<FoodItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeCuisine, setActiveCuisine] = useState<CuisineType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectFood, setInspectFood] = useState<FoodItem | null>(null);
  const [mealServed, setMealServed] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: getTranslation(language, 'filterAllFoods') },
    { id: 'vegetables', label: getTranslation(language, 'filterVeggies') },
    { id: 'fruits', label: getTranslation(language, 'filterFruits') },
    { id: 'grains', label: getTranslation(language, 'filterGrains') },
    { id: 'protein', label: getTranslation(language, 'filterProteins') },
    { id: 'dairy_alt', label: getTranslation(language, 'filterDairyAlt') },
    { id: 'hydration', label: getTranslation(language, 'filterHydration') },
  ];

  const cuisines: { id: CuisineType; label: string; flag: string }[] = [
    { id: 'all', label: getTranslation(language, 'cuisineAll'), flag: '🌍' },
    { id: 'chinese', label: getTranslation(language, 'cuisineChinese'), flag: '🇨🇳' },
    { id: 'spanish', label: getTranslation(language, 'cuisineSpanish'), flag: '🇪🇸' },
    { id: 'turkish', label: getTranslation(language, 'cuisineTurkish'), flag: '🇹🇷' },
    { id: 'indian', label: getTranslation(language, 'cuisineIndian'), flag: '🇮🇳' },
    { id: 'french', label: getTranslation(language, 'cuisineFrench'), flag: '🇫🇷' },
  ];

  const handleAddFood = (food: FoodItem) => {
    if (plateFoods.length >= 6) {
      soundFx.playClick();
      return;
    }
    soundFx.playWaterDrop();
    setPlateFoods((prev) => [...prev, food]);
  };

  const handleRemoveFood = (index: number) => {
    soundFx.playClick();
    setPlateFoods((prev) => prev.filter((_, i) => i !== index));
    setMealServed(false);
  };

  const handleClearPlate = () => {
    soundFx.playClick();
    setPlateFoods([]);
    setMealServed(false);
  };

  const handleServePlate = () => {
    soundFx.playSuccess();
    setMealServed(true);
    onMealComplete(25);
  };

  // Unique categories represented on plate
  const uniqueCategories = Array.from(new Set(plateFoods.map((f) => f.category)));
  const hasVeggies = uniqueCategories.includes('vegetables');
  const hasFruits = uniqueCategories.includes('fruits');
  const hasGrains = uniqueCategories.includes('grains');
  const hasProtein = uniqueCategories.includes('protein');
  const hasDairyAlt = uniqueCategories.includes('dairy_alt');
  const hasHydration = uniqueCategories.includes('hydration');

  const balanceScore = uniqueCategories.length; // 1 to 6

  const filteredFoods = FOOD_DATABASE.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesCuisine =
      activeCuisine === 'all' || item.cuisine === activeCuisine || item.cuisine === 'global';
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nativeName && item.nativeName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesCuisine && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <span>{getTranslation(language, 'appName')}</span>
            <span>·</span>
            <span>{getTranslation(language, 'mealBuilderTitle')}</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            {getTranslation(language, 'mealBuilderTitle')}
          </h1>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            {getTranslation(language, 'mealBuilderSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearPlate}
            disabled={plateFoods.length === 0}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'clearPlate')}</span>
          </button>
        </div>
      </div>

      {/* Global Cuisine Switcher Tabs */}
      <div className="bg-white rounded-2xl border border-amber-900/10 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Globe2 className="w-4 h-4 text-emerald-600" />
            <span>{getTranslation(language, 'cuisineFilter')}:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {cuisines.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveCuisine(c.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                  activeCuisine === c.id
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-amber-50/70 text-slate-700 hover:bg-amber-100/70'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: The Plate Stage & Balance Evaluation (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs space-y-6">
          {/* Plate Visual */}
          <div className="relative flex flex-col items-center justify-center p-4">
            {/* The Plate Circular Container */}
            <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-slate-50 border-8 border-amber-100/90 shadow-lg relative flex flex-wrap items-center justify-center p-4 overflow-hidden">
              {/* Subtle quadrant guidelines */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-2 grid-rows-2 opacity-30 border border-slate-300">
                <div className="border-r border-b border-dashed border-slate-400 p-2 text-[10px] font-bold text-emerald-800 flex items-start">
                  Veggies
                </div>
                <div className="border-b border-dashed border-slate-400 p-2 text-[10px] font-bold text-rose-800 flex items-start justify-end">
                  Fruits
                </div>
                <div className="border-r border-dashed border-slate-400 p-2 text-[10px] font-bold text-amber-800 flex items-end">
                  Grains
                </div>
                <div className="p-2 text-[10px] font-bold text-purple-800 flex items-end justify-end">
                  Proteins
                </div>
              </div>

              {/* Placed foods */}
              {plateFoods.length === 0 ? (
                <div className="relative z-10 text-center space-y-1 text-slate-400 max-w-[200px]">
                  <Utensils className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-medium">
                    {getTranslation(language, 'plateEmpty')}
                  </p>
                </div>
              ) : (
                <div className="relative z-10 grid grid-cols-3 gap-2 w-full max-w-[240px]">
                  {plateFoods.map((item, idx) => (
                    <div
                      key={`${item.id}-${idx}`}
                      className="bg-white/95 backdrop-blur-xs border border-amber-200 rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-xs hover:border-rose-400 group cursor-pointer transition-transform hover:scale-105"
                      onClick={() => handleRemoveFood(idx)}
                      title={`Remove ${item.name} from plate`}
                    >
                      <span className="text-2xl mb-1">{item.icon}</span>
                      <span className="text-[10px] font-semibold text-slate-800 truncate w-full">
                        {item.name.split(' ')[0]}
                      </span>
                      <span className="text-[9px] text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        ✕
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Food Count Badge */}
            <div className="mt-3 text-xs text-slate-500 font-medium">
              Plate items: <span className="font-bold text-slate-800">{plateFoods.length}/6</span>
            </div>
          </div>

          {/* Nutritional Balance Feedback Matrix */}
          <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                {getTranslation(language, 'balanceScore')} ({balanceScore} / 5)
              </span>
              <span className="text-xs font-semibold text-emerald-800">
                {balanceScore >= 4
                  ? '🌟 ' + getTranslation(language, 'balanceExcellent')
                  : balanceScore >= 2
                  ? '👍 ' + getTranslation(language, 'balanceGood')
                  : '🌱 ' + getTranslation(language, 'balanceStart')}
              </span>
            </div>

            {/* Visual Indicators for Groups */}
            <div className="grid grid-cols-5 gap-1.5 text-center text-[11px]">
              <div
                className={`py-1.5 px-1 rounded-lg border font-semibold ${
                  hasVeggies
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                🥦 {hasVeggies ? '✓' : ''}
              </div>
              <div
                className={`py-1.5 px-1 rounded-lg border font-semibold ${
                  hasFruits
                    ? 'bg-rose-100 border-rose-300 text-rose-900'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                🍎 {hasFruits ? '✓' : ''}
              </div>
              <div
                className={`py-1.5 px-1 rounded-lg border font-semibold ${
                  hasGrains
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                🌾 {hasGrains ? '✓' : ''}
              </div>
              <div
                className={`py-1.5 px-1 rounded-lg border font-semibold ${
                  hasProtein
                    ? 'bg-purple-100 border-purple-300 text-purple-900'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                🫘 {hasProtein ? '✓' : ''}
              </div>
              <div
                className={`py-1.5 px-1 rounded-lg border font-semibold ${
                  hasDairyAlt || hasHydration
                    ? 'bg-sky-100 border-sky-300 text-sky-900'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                💧 {hasDairyAlt || hasHydration ? '✓' : ''}
              </div>
            </div>

            {/* Educational Nutritional Synergy Insight */}
            <div className="bg-white rounded-lg p-3 border border-amber-200/60 text-xs space-y-1">
              <div className="font-semibold text-slate-900 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-emerald-600" />
                <span>{getTranslation(language, 'whyItMatters')}:</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {hasVeggies && hasProtein && hasGrains
                  ? "Outstanding balance! The complex carbohydrates from your grains provide sustained slow-burning glucose for your brain, while proteins rebuild muscle tissue and vegetables deliver essential micronutrients and fiber."
                  : hasVeggies && !hasProtein
                  ? "Great plant vitamins! Try adding a protein source (like black beans, eggs, tofu, or lentils) to help keep your muscles strong and prevent mid-afternoon hunger."
                  : hasGrains && !hasVeggies
                  ? "Nice energy foundation! Adding colorful greens, ratatouille, or veggies will introduce vital dietary fiber to nourish your gut microbiome."
                  : "Every balanced meal is a team effort of different food colors and textures. Select at least 3 distinct food groups to see the magic happen!"}
              </p>
            </div>

            {/* Serve Button */}
            <button
              onClick={handleServePlate}
              disabled={plateFoods.length < 2 || mealServed}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mealServed
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : plateFoods.length >= 2
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {mealServed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{getTranslation(language, 'completed')} (+25 {getTranslation(language, 'seedsLabel')})</span>
                </>
              ) : (
                <>
                  <HeartHandshake className="w-4 h-4" />
                  <span>{getTranslation(language, 'serveMeal')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Pantry Shelf & Nutrition Label Detective (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-amber-900/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-display">
                Whole Foods Pantry
              </h3>
              <span className="text-xs text-slate-500">Tap to place on plate</span>
            </div>

            {/* Search input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search foods (e.g. broccoli, tofu, dal, paella)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            {/* Category filter tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveCategory(cat.id);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap cursor-pointer transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Food Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1">
              {filteredFoods.map((food) => {
                const isAlreadyOnPlate = plateFoods.some((f) => f.id === food.id);
                return (
                  <div
                    key={food.id}
                    className={`rounded-xl p-2.5 border transition-all flex flex-col justify-between text-left ${
                      isAlreadyOnPlate
                        ? 'bg-emerald-50/50 border-emerald-300'
                        : 'bg-slate-50/60 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="text-2xl">{food.icon}</span>
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setInspectFood(food);
                        }}
                        className="text-[10px] text-slate-500 hover:text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-slate-200 cursor-pointer"
                        title="Inspect nutrition facts"
                      >
                        Info
                      </button>
                    </div>

                    <div className="text-xs font-bold text-slate-800 line-clamp-2">
                      {food.name}
                    </div>

                    {food.nativeName && (
                      <div className="text-[10px] text-amber-800/80 font-medium italic truncate">
                        {food.nativeName}
                      </div>
                    )}

                    <div className="text-[10px] text-emerald-700 font-medium truncate mt-0.5">
                      {food.nutritionalHero}
                    </div>

                    <button
                      onClick={() => handleAddFood(food)}
                      disabled={plateFoods.length >= 6}
                      className="mt-2 w-full py-1 text-[11px] font-semibold rounded bg-white hover:bg-emerald-600 hover:text-white border border-slate-300 transition-colors cursor-pointer text-slate-700 disabled:opacity-40"
                    >
                      + Add to Plate
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Learning Tip */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>{getTranslation(language, 'portionGuide')}:</strong> A palm-sized portion of protein (lentils, fish, tofu, eggs), a fist of grains, and half your plate full of colorful vegetables and fruits gives your body balanced energy!
            </div>
          </div>
        </div>
      </div>

      {/* Nutrition Label Detective Modal */}
      {inspectFood && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-amber-900/10 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{inspectFood.icon}</span>
                <div>
                  <h4 className="text-base font-bold text-slate-900 font-display">
                    {inspectFood.name}
                  </h4>
                  {inspectFood.nativeName && (
                    <p className="text-xs text-amber-700 font-medium">{inspectFood.nativeName}</p>
                  )}
                  <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                    {inspectFood.category} · {inspectFood.portionVisual}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setInspectFood(null)}
                className="text-slate-400 hover:text-slate-700 text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Educational Label Card (Age-appropriate, No calorie counting) */}
            <div className="border-2 border-slate-900 p-3 rounded-lg font-mono text-xs space-y-2 bg-amber-50/20">
              <div className="border-b-4 border-slate-900 pb-1">
                <div className="font-bold text-sm">Wholesome Nutrition Facts</div>
                <div className="text-[10px] text-slate-600">Standard serving: {inspectFood.portionVisual}</div>
              </div>

              <div className="space-y-1 text-slate-800 text-[11px]">
                <div className="flex justify-between border-b border-slate-300 py-0.5">
                  <span className="font-bold">Primary Nutrient Hero:</span>
                  <span className="font-semibold text-emerald-800">{inspectFood.nutritionalHero}</span>
                </div>
                <div className="flex justify-between border-b border-slate-300 py-0.5">
                  <span>Dietary Fiber:</span>
                  <span className="text-slate-900">Abundant (Feeds friendly gut flora)</span>
                </div>
                <div className="flex justify-between border-b border-slate-300 py-0.5">
                  <span>Added Sugars:</span>
                  <span className="text-emerald-700 font-bold">0g (Natural Whole Food)</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-600">
                {gradeLevel === 'middle_school'
                  ? inspectFood.middleSchoolFact
                  : inspectFood.energyBenefit}
              </div>
            </div>

            {/* Fun Fact Callout */}
            <div className="p-2.5 bg-emerald-50 rounded-lg text-xs text-emerald-900 border border-emerald-200">
              💡 <strong>{getTranslation(language, 'foodFunFact')}</strong> {inspectFood.funFact}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  handleAddFood(inspectFood);
                  setInspectFood(null);
                }}
                className="w-full py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                + Add to Plate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
