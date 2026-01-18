
import React, { useState } from 'react';
import { AppTab, Meal, DailyQuest } from './types';
import Dashboard from './components/Dashboard';
import AICoach from './components/AICoach';
import LogFood from './components/LogFood';
import Community from './components/Community';
import FoodDelivery from './components/FoodDelivery';
import { Home, MessageSquare, PlusCircle, Users, User, ShoppingBag } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [quests] = useState<DailyQuest[]>([
    { id: '1', title: 'Hydration Hero', description: 'Drink 2L of water', points: 10, completed: false },
    { id: '2', title: 'Veggie Power', description: 'Include greens in 2 meals', points: 15, completed: true },
    { id: '3', title: 'Step Master', description: 'Reach 8,000 steps', points: 20, completed: false }
  ]);

  const addMeal = (meal: Meal) => {
    setMeals([meal, ...meals]);
    setActiveTab(AppTab.DASHBOARD);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 relative overflow-hidden shadow-2xl">
      {/* Header */}
      <header className="p-4 bg-white border-b flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <h1 className="text-xl font-bold text-emerald-600 tracking-tight">Cofit<span className="text-slate-800">Plus</span></h1>
        <div className="flex items-center gap-2">
          <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
            LV. 12
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        {activeTab === AppTab.DASHBOARD && (
          <Dashboard meals={meals} quests={quests} onOrderClick={() => setActiveTab(AppTab.DELIVERY)} />
        )}
        {activeTab === AppTab.COACH && <AICoach meals={meals} />}
        {activeTab === AppTab.LOG && <LogFood onLog={addMeal} />}
        {activeTab === AppTab.DELIVERY && <FoodDelivery onOrderSuccess={addMeal} />}
        {activeTab === AppTab.COMMUNITY && <Community />}
        {activeTab === AppTab.PROFILE && (
          <div className="p-8 text-center text-slate-500">Profile Settings (Coming Soon)</div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t flex justify-around py-3 px-2 shadow-lg z-20 rounded-t-3xl">
        <NavItem active={activeTab === AppTab.DASHBOARD} onClick={() => setActiveTab(AppTab.DASHBOARD)} icon={<Home size={22} />} label="Home" />
        <NavItem active={activeTab === AppTab.DELIVERY} onClick={() => setActiveTab(AppTab.DELIVERY)} icon={<ShoppingBag size={22} />} label="Eat" />
        <button onClick={() => setActiveTab(AppTab.LOG)} className="flex items-center justify-center -mt-10 bg-emerald-500 text-white p-4 rounded-full shadow-xl transition-transform active:scale-95">
          <PlusCircle size={28} />
        </button>
        <NavItem active={activeTab === AppTab.COACH} onClick={() => setActiveTab(AppTab.COACH)} icon={<MessageSquare size={22} />} label="Coach" />
        <NavItem active={activeTab === AppTab.COMMUNITY} onClick={() => setActiveTab(AppTab.COMMUNITY)} icon={<Users size={22} />} label="Social" />
      </nav>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-emerald-500' : 'text-slate-400'}`}>
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;
