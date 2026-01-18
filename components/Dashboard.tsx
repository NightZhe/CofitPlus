
import React, { useState, useEffect, useRef } from 'react';
import { Meal, DailyQuest } from '../types';
import { Flame, Droplet, Heart, MessageCircle, Sparkles, TrendingUp, X, Share2, Bookmark, Plus, Info, ShoppingCart, Clock } from 'lucide-react';

interface Props {
  meals: Meal[];
  quests: DailyQuest[];
  onOrderClick: () => void;
}

const Dashboard: React.FC<Props> = ({ meals, quests, onOrderClick }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const targetCalories = 2200;

  const discoveryItems = [
    ...meals.map((m, i) => ({ ...m, type: 'user_meal', likes: '12', user: 'You', avatar: 'https://i.pravatar.cc/150?u=you' })),
    {
      id: 'delivery_1',
      name: '舒肥雞胸能量餐盒',
      calories: 520,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      type: 'delivery',
      tags: ['健身必吃', '20分鐘送達'],
      likes: '3.5k',
      user: '強尼兄弟健康餐',
      avatar: 'https://i.pravatar.cc/150?u=johnny',
      feedback: '這份餐盒提供優質複合碳水，特別適合重訓後的能量補充。',
      price: 180
    },
    {
      id: 'ai_1',
      name: '藍莓奇亞籽活力碗',
      calories: 320,
      image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
      type: 'recipe',
      tags: ['高蛋白', '早餐'],
      likes: '1.2k',
      user: 'Cofit Kitchen',
      avatar: 'https://i.pravatar.cc/150?u=cofit',
      feedback: '藍莓與奇亞籽的組合能提供長效飽足感。'
    },
    {
      id: 'delivery_2',
      name: '挪威鯖魚低卡便當',
      calories: 480,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
      type: 'delivery',
      tags: ['Omega-3', '15分鐘送達'],
      likes: '1.8k',
      user: '能量小姐',
      avatar: 'https://i.pravatar.cc/150?u=miss',
      feedback: '鯖魚含有豐富的魚油，對心血管健康非常有幫助。',
      price: 210
    }
  ].sort(() => 0.5 - Math.random());

  useEffect(() => {
    if (selectedIndex !== null && scrollRef.current) {
      scrollRef.current.scrollTo({ top: selectedIndex * window.innerHeight, behavior: 'instant' });
    }
  }, [selectedIndex]);

  return (
    <div className="space-y-6 pb-20">
      {/* 頂部數據看板 */}
      <section className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
        <div className="flex-shrink-0 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3 min-w-[160px]">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
              <circle cx="24" cy="24" r="20" stroke="#10b981" strokeWidth="4" fill="transparent" 
                strokeDasharray={`${(totalCalories / targetCalories) * 125.6} 125.6`} strokeLinecap="round" />
            </svg>
            <Flame className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500" size={16} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Energy</div>
            <div className="text-sm font-black text-slate-800">{totalCalories} <span className="text-[10px] font-normal font-medium text-slate-400">/ 2200</span></div>
          </div>
        </div>
        <div className="flex-shrink-0 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3 min-w-[140px]">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <Droplet size={20} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Water</div>
            <div className="text-sm font-black text-slate-800">1.2 <span className="text-[10px] text-slate-400">L</span></div>
          </div>
        </div>
      </section>

      {/* 小紅書式瀑布流 */}
      <div className="columns-2 gap-4 space-y-4">
        {discoveryItems.map((item: any, idx) => (
          <div key={item.id + idx} onClick={() => setSelectedIndex(idx)} className="break-inside-avoid bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm active:scale-[0.98] transition-transform duration-200 cursor-pointer relative">
            <div className="relative">
              <img src={item.image} alt={item.name} className="w-full object-cover" />
              {item.type === 'delivery' && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-lg">
                  <ShoppingCart size={10} /> Order & Log
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] px-2 py-0.5 rounded-lg font-bold shadow-sm">
                {item.calories} kcal
              </div>
            </div>
            <div className="p-3">
              <h4 className="text-xs font-bold text-slate-800 line-clamp-2 mb-2">{item.name}</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <img src={item.avatar} className="w-4 h-4 rounded-full" alt="avatar" />
                  <span className="text-[9px] text-slate-400 font-medium truncate max-w-[60px]">{item.user}</span>
                </div>
                <div className="flex items-center gap-0.5 text-slate-300">
                  <Heart size={8} fill="currentColor" />
                  <span className="text-[8px] font-bold">{item.likes}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 沈浸模式 Overlay */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black animate-in fade-in duration-300 overflow-hidden">
          <div ref={scrollRef} className="h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
            {discoveryItems.map((item: any, idx) => (
              <div key={item.id + idx} className="h-full w-full relative snap-start">
                <div className="absolute inset-0">
                  <img src={item.image} className="w-full h-full object-cover" alt="Main Content" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90"></div>
                </div>

                <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
                  <button onClick={() => setSelectedIndex(null)} className="p-2.5 bg-black/20 backdrop-blur-xl rounded-full text-white"><X size={24} /></button>
                  <div className="bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                    <Sparkles size={16} className="text-emerald-400" />
                    <span className="text-white text-xs font-bold">AI Health Check</span>
                  </div>
                  <button className="p-2.5 bg-black/20 backdrop-blur-xl rounded-full text-white"><Share2 size={24} /></button>
                </div>

                <div className="absolute right-4 bottom-32 z-20 flex flex-col gap-6 items-center">
                  <div className="flex flex-col items-center gap-1">
                    <img src={item.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-lg" alt="Author" />
                    <span className="text-[10px] text-white font-bold">Follow</span>
                  </div>
                  <button className="p-3.5 bg-white/10 backdrop-blur-xl rounded-full text-white"><Heart size={30} /></button>
                  <button className="p-3.5 bg-white/10 backdrop-blur-xl rounded-full text-white"><MessageCircle size={30} /></button>
                  <button className="p-3.5 bg-white/10 backdrop-blur-xl rounded-full text-white"><Bookmark size={30} /></button>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 pb-12 z-20">
                   <div className="flex items-center gap-2 mb-3">
                      <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">{item.type}</span>
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/20">{item.calories} kcal</span>
                   </div>
                   <h2 className="text-2xl font-black text-white mb-2 drop-shadow-lg">{item.name}</h2>
                   
                   <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-5 border border-white/20 shadow-2xl">
                      <p className="text-white/90 text-sm leading-relaxed mb-4 italic">"{item.feedback}"</p>
                      
                      {item.type === 'delivery' ? (
                        <button 
                          onClick={onOrderClick}
                          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
                        >
                          <ShoppingCart size={18} />
                          立即外送 · ${item.price} (自動記帳)
                        </button>
                      ) : (
                        <button className="w-full bg-white text-emerald-600 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2">
                          <Plus size={18} /> 加入今日餐盤
                        </button>
                      )}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
