
import React, { useState } from 'react';
import { Meal } from '../types';
// Fix: Added missing 'Flame' icon import from lucide-react
import { Search, MapPin, Clock, Star, Filter, ArrowRight, CheckCircle2, ShoppingBag, Flame } from 'lucide-react';

interface Props {
  onOrderSuccess: (meal: Meal) => void;
}

const FoodDelivery: React.FC<Props> = ({ onOrderSuccess }) => {
  const [ordered, setOrdered] = useState(false);

  const restaurants = [
    {
      id: 'r1',
      name: '強尼兄弟健康餐',
      rating: 4.8,
      time: '15-20 min',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      avgCal: '450-600 kcal',
      isHealthy: true
    },
    {
      id: 'r2',
      name: '能量小姐 Miss Energy',
      rating: 4.7,
      time: '20-30 min',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
      avgCal: '400-550 kcal',
      isHealthy: true
    },
    {
      id: 'r3',
      name: '沃得低卡廚房',
      rating: 4.9,
      time: '10-15 min',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
      avgCal: '350-500 kcal',
      isHealthy: true
    }
  ];

  const handleOrder = () => {
    setOrdered(true);
    setTimeout(() => {
      onOrderSuccess({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        type: 'Lunch',
        name: '外送：舒肥雞能量餐盒',
        calories: 550,
        macros: { protein: 35, carbs: 45, fat: 12 },
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
        feedback: '這份外送餐點非常平衡，蛋白質量充足！',
        isOrdered: true
      });
    }, 2000);
  };

  if (ordered) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 text-center px-6">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800">下單成功！</h2>
          <p className="text-slate-500 mt-2 font-medium">餐點預計 18 分鐘送達</p>
          <div className="mt-6 bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3">
            <ShoppingBag className="text-emerald-600" size={20} />
            <p className="text-sm text-emerald-800 font-bold">已自動將 550 kcal 紀錄至今日午餐</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* 頂部外送導航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-emerald-500" />
          <span className="font-bold text-sm text-slate-700">台北市大安區...</span>
        </div>
        <div className="bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2">
          <Clock size={14} className="text-slate-500" />
          <span className="text-xs font-bold text-slate-600">ASAP</span>
        </div>
      </div>

      {/* 搜尋 */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="搜尋附近的健康餐點..." 
          className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      {/* 類別 */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
        {['低碳水', '高蛋白', '生酮專區', '蔬食料理', '人氣排行'].map((cat, i) => (
          <button key={cat} className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold border ${i === 0 ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-white border-slate-100 text-slate-500'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* 餐廳列表 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
            符合你今日剩餘卡路里
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-black">AI 推薦</span>
          </h3>
          <Filter size={18} className="text-slate-400" />
        </div>

        {restaurants.map(res => (
          <div key={res.id} onClick={handleOrder} className="group cursor-pointer">
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-md group-active:scale-[0.98] transition-all">
              <img src={res.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={res.name} />
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1 shadow-xl">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold">{res.rating}</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex justify-between items-center">
                <div className="text-white">
                  <h4 className="font-black text-base">{res.name}</h4>
                  <div className="flex items-center gap-3 mt-1 opacity-90">
                    <span className="text-[10px] font-bold flex items-center gap-1">
                      <Clock size={10} /> {res.time}
                    </span>
                    <span className="text-[10px] font-bold flex items-center gap-1 text-emerald-300">
                      <Flame size={10} /> 平均 {res.avgCal}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-500">
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodDelivery;
