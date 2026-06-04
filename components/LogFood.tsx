import React, { useState, useRef } from 'react';
import { Meal } from '../types';
import { Camera, Search, X, CheckCircle2, ChevronDown } from 'lucide-react';

interface Props {
  onLog: (meal: Meal) => void;
}

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  emoji: string;
}

const FOOD_DB: FoodItem[] = [
  { name: '雞胸肉（100g）', calories: 165, protein: 31, carbs: 0, fat: 3.6, emoji: '🍗' },
  { name: '水煮蛋（1顆）', calories: 78, protein: 6, carbs: 1, fat: 5, emoji: '🥚' },
  { name: '白飯（1碗）', calories: 280, protein: 5, carbs: 62, fat: 0.5, emoji: '🍚' },
  { name: '燕麥粥（1碗）', calories: 166, protein: 6, carbs: 28, fat: 3, emoji: '🥣' },
  { name: '香蕉（1根）', calories: 89, protein: 1, carbs: 23, fat: 0.3, emoji: '🍌' },
  { name: '蘋果（1顆）', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, emoji: '🍎' },
  { name: '希臘優格（1杯）', calories: 130, protein: 17, carbs: 9, fat: 0.7, emoji: '🫙' },
  { name: '豆漿（500ml）', calories: 180, protein: 12, carbs: 16, fat: 6, emoji: '🥛' },
  { name: '三明治（火腿蛋）', calories: 320, protein: 16, carbs: 35, fat: 12, emoji: '🥪' },
  { name: '蛋餅', calories: 260, protein: 10, carbs: 32, fat: 10, emoji: '🫔' },
  { name: '雞腿便當', calories: 680, protein: 28, carbs: 75, fat: 28, emoji: '🍱' },
  { name: '排骨飯', calories: 720, protein: 30, carbs: 80, fat: 26, emoji: '🍱' },
  { name: '滷肉飯（小）', calories: 420, protein: 18, carbs: 52, fat: 15, emoji: '🍚' },
  { name: '牛肉麵（大）', calories: 680, protein: 35, carbs: 72, fat: 22, emoji: '🍜' },
  { name: '陽春麵', calories: 380, protein: 12, carbs: 68, fat: 6, emoji: '🍜' },
  { name: '水餃（10顆）', calories: 420, protein: 18, carbs: 55, fat: 14, emoji: '🥟' },
  { name: '沙拉（蔬菜）', calories: 80, protein: 3, carbs: 12, fat: 4, emoji: '🥗' },
  { name: '雞肉沙拉', calories: 250, protein: 28, carbs: 10, fat: 11, emoji: '🥗' },
  { name: '鮭魚（100g）', calories: 208, protein: 20, carbs: 0, fat: 13, emoji: '🐟' },
  { name: '豆腐（嫩豆腐）', calories: 76, protein: 8, carbs: 2, fat: 4, emoji: '🫙' },
  { name: '地瓜（1顆）', calories: 130, protein: 2, carbs: 30, fat: 0.2, emoji: '🍠' },
  { name: '花椰菜（1碗）', calories: 55, protein: 4, carbs: 11, fat: 0.6, emoji: '🥦' },
  { name: '牛奶（240ml）', calories: 149, protein: 8, carbs: 12, fat: 8, emoji: '🥛' },
  { name: '咖啡（黑，無糖）', calories: 5, protein: 0.3, carbs: 0, fat: 0, emoji: '☕' },
  { name: '珍珠奶茶（大）', calories: 380, protein: 3, carbs: 68, fat: 10, emoji: '🧋' },
  { name: '麥當勞大麥克', calories: 550, protein: 25, carbs: 46, fat: 30, emoji: '🍔' },
  { name: '麥當勞薯條（大）', calories: 490, protein: 6, carbs: 66, fat: 23, emoji: '🍟' },
  { name: '披薩（1片）', calories: 285, protein: 12, carbs: 36, fat: 10, emoji: '🍕' },
  { name: '蝦仁炒飯', calories: 560, protein: 22, carbs: 76, fat: 16, emoji: '🍳' },
  { name: '番茄炒蛋', calories: 210, protein: 12, carbs: 8, fat: 14, emoji: '🍅' },
];

const MEAL_TYPES: Meal['type'][] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const MEAL_LABELS: Record<Meal['type'], string> = {
  Breakfast: '早餐',
  Lunch: '午餐',
  Dinner: '晚餐',
  Snack: '點心',
};

const getFeedback = (item: FoodItem): string => {
  if (item.protein >= 20) return `${item.name}蛋白質含量高，非常適合增肌減脂！`;
  if (item.calories <= 100) return `低熱量好選擇，繼續保持健康飲食習慣。`;
  if (item.carbs >= 60) return `碳水化合物偏高，建議搭配蛋白質一起食用。`;
  if (item.fat >= 25) return `脂肪含量較高，今天其他餐次可以選擇清淡一點。`;
  return `整體營養均衡，是不錯的選擇！記得多喝水。`;
};

const LogFood: React.FC<Props> = ({ onLog }) => {
  const [query, setQuery] = useState('');
  const [mealType, setMealType] = useState<Meal['type']>('Lunch');
  const [selected, setSelected] = useState<FoodItem | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [logged, setLogged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const results = query.trim()
    ? FOOD_DB.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    : FOOD_DB.slice(0, 10);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (!selected) return;
    onLog({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      type: mealType,
      name: selected.name,
      calories: selected.calories,
      macros: { protein: selected.protein, carbs: selected.carbs, fat: selected.fat },
      image: image || undefined,
      feedback: getFeedback(selected),
    });
    setLogged(true);
    setTimeout(() => {
      setLogged(false);
      setSelected(null);
      setQuery('');
      setImage(null);
    }, 1500);
  };

  if (logged) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800">已記錄！</h2>
          <p className="text-slate-500 mt-1 text-sm">{selected?.name} 已加入今日紀錄</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">記錄餐點</h2>
        {selected && (
          <button onClick={() => setSelected(null)} className="text-slate-400 p-1"><X size={20} /></button>
        )}
      </div>

      {/* 餐次選擇 */}
      <div className="relative">
        <button
          onClick={() => setShowTypeMenu(!showTypeMenu)}
          className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 flex justify-between items-center shadow-sm"
        >
          <span className="font-bold text-slate-700">{MEAL_LABELS[mealType]}</span>
          <ChevronDown size={18} className="text-slate-400" />
        </button>
        {showTypeMenu && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-slate-100 rounded-2xl shadow-lg z-10 overflow-hidden">
            {MEAL_TYPES.map(t => (
              <button
                key={t}
                onClick={() => { setMealType(t); setShowTypeMenu(false); }}
                className={`w-full px-5 py-3 text-left text-sm font-semibold hover:bg-emerald-50 transition-colors ${mealType === t ? 'text-emerald-600 bg-emerald-50' : 'text-slate-700'}`}
              >
                {MEAL_LABELS[t]}
              </button>
            ))}
          </div>
        )}
      </div>

      {!selected ? (
        <>
          {/* 搜尋 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="搜尋食物名稱..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <X size={16} />
              </button>
            )}
          </div>

          {/* 拍照 */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-white border-2 border-dashed border-slate-200 rounded-2xl p-4 flex items-center gap-3 text-slate-500 hover:border-emerald-300 hover:text-emerald-600 transition-all active:scale-95"
          >
            <div className="bg-slate-50 p-2.5 rounded-full"><Camera size={20} /></div>
            <span className="text-sm font-bold">拍照留存（選填）</span>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
          </button>
          {image && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
              <img src={image} className="w-full h-full object-cover" alt="meal preview" />
              <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full">
                <X size={14} />
              </button>
            </div>
          )}

          {/* 食物列表 */}
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">
              {query ? `搜尋結果（${results.length}）` : '常見食物'}
            </p>
            <div className="space-y-2">
              {results.length === 0 && (
                <p className="text-center text-slate-400 py-8 text-sm">找不到符合的食物</p>
              )}
              {results.map(item => (
                <button
                  key={item.name}
                  onClick={() => setSelected(item)}
                  className="w-full bg-white border border-slate-100 rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm active:scale-[0.98] transition-all text-left hover:border-emerald-200"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-400">蛋白質 {item.protein}g · 碳水 {item.carbs}g · 脂肪 {item.fat}g</p>
                  </div>
                  <span className="text-emerald-600 font-black text-sm flex-shrink-0">{item.calories} kcal</span>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* 確認頁面 */
        <div className="space-y-5">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            {image && <img src={image} className="w-full h-48 object-cover" alt="Meal" />}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{selected.emoji}</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{selected.name}</h3>
                  <span className="text-xs text-slate-400 font-medium">{MEAL_LABELS[mealType]}</span>
                </div>
              </div>
              <div className="text-emerald-600 font-black text-3xl mb-5">{selected.calories} kcal</div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: '蛋白質', value: selected.protein },
                  { label: '碳水', value: selected.carbs },
                  { label: '脂肪', value: selected.fat },
                ].map(m => (
                  <div key={m.label} className="text-center bg-slate-50 rounded-2xl py-3">
                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">{m.label}</div>
                    <div className="font-black text-slate-800">{m.value}g</div>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <p className="text-sm text-emerald-800 leading-relaxed">💡 {getFeedback(selected)}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setSelected(null)}
              className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
            >
              重新選擇
            </button>
            <button
              onClick={handleConfirm}
              className="flex-[2] bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-colors active:scale-95"
            >
              記錄這份餐點
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogFood;
