import React, { useState, useEffect, useRef } from 'react';
import { Meal } from '../types';
import { Send, BrainCircuit, Bot, Sparkles } from 'lucide-react';

interface Props {
  meals: Meal[];
}

interface Message {
  role: 'ai' | 'user';
  text: string;
}

const TARGET_CALORIES = 2200;
const TARGET_PROTEIN = 60;

const generateAnalysis = (meals: Meal[]): string => {
  if (meals.length === 0) {
    return '還沒有今日紀錄，先去記錄你的第一餐吧！記錄飲食是達成健康目標的第一步。';
  }
  const totalCal = meals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = meals.reduce((s, m) => s + m.macros.protein, 0);
  const totalCarbs = meals.reduce((s, m) => s + m.macros.carbs, 0);
  const totalFat = meals.reduce((s, m) => s + m.macros.fat, 0);
  const remaining = TARGET_CALORIES - totalCal;

  const lines: string[] = [];
  lines.push(`📊 今日攝取：${totalCal} kcal（目標 ${TARGET_CALORIES} kcal）`);

  if (remaining > 0) {
    lines.push(`還剩 ${remaining} kcal 可以攝取。`);
  } else {
    lines.push(`⚠️ 已超標 ${Math.abs(remaining)} kcal，晚餐建議選擇輕食。`);
  }

  if (totalProtein < TARGET_PROTEIN) {
    lines.push(`💪 蛋白質目前 ${totalProtein}g，建議補充雞胸肉、雞蛋或豆腐來達標（目標 ${TARGET_PROTEIN}g）。`);
  } else {
    lines.push(`✅ 蛋白質攝取良好（${totalProtein}g），繼續保持！`);
  }

  const carbRatio = Math.round((totalCarbs * 4 / Math.max(totalCal, 1)) * 100);
  if (carbRatio > 55) {
    lines.push(`🍚 碳水比例偏高（${carbRatio}%），下一餐可以減少澱粉，增加蔬菜。`);
  }

  if (totalFat > 60) {
    lines.push(`🥑 今日脂肪攝取較多（${totalFat}g），盡量避免油炸食物。`);
  }

  return lines.join('\n');
};

const QUICK_REPLIES = [
  '今天吃什麼比較好？',
  '我想減脂，有什麼建議？',
  '增肌要注意什麼？',
  '幫我分析今日飲食',
  '推薦高蛋白食物',
  '多少水該喝？',
];

const RULE_RESPONSES: Record<string, string> = {
  '減脂': '減脂關鍵：製造熱量缺口（每天少攝取 300-500 kcal）、提高蛋白質比例（體重 × 1.6g）、保持適量有氧運動。避免精緻糖和加工食品。',
  '增肌': '增肌三要素：\n1. 蛋白質攝取充足（體重 × 2g）\n2. 重訓後 30 分鐘內補充蛋白質\n3. 保持熱量盈餘（每天多 200-300 kcal）\n睡眠也非常重要，至少 7-8 小時。',
  '今天吃': '建議今天可以選擇：\n🍗 雞胸肉便當（高蛋白低脂）\n🥗 生菜沙拉搭配水煮蛋\n🐟 清蒸鮭魚配地瓜\n\n避免炸雞、珍奶、白麵包等高糖高脂食物。',
  '高蛋白': '優質高蛋白食物：\n• 雞胸肉 100g ➜ 31g 蛋白質\n• 鮭魚 100g ➜ 20g 蛋白質\n• 雞蛋 1顆 ➜ 6g 蛋白質\n• 希臘優格 1杯 ➜ 17g 蛋白質\n• 豆腐 100g ➜ 8g 蛋白質',
  '喝水': '每天建議飲水量：體重（kg）× 30-35 ml。\n例如 60kg 的人每天需要喝 1800-2100 ml。\n運動後要額外補充。建議養成每小時喝一杯水的習慣。',
  '分析': '',
};

const getAutoResponse = (input: string, meals: Meal[]): string => {
  const lower = input.toLowerCase();
  for (const [key, resp] of Object.entries(RULE_RESPONSES)) {
    if (lower.includes(key)) {
      if (key === '分析') return generateAnalysis(meals);
      return resp;
    }
  }
  if (lower.includes('謝') || lower.includes('thank')) return '不客氣！有任何飲食問題都可以問我 😊 記得今天多喝水！';
  if (lower.includes('好') || lower.includes('ok') || lower.includes('了解')) return '太好了！堅持記錄飲食，你離目標越來越近了 💪';
  return `根據你的問題「${input}」，建議你搜尋更具體的關鍵字，例如「減脂」、「增肌」、「高蛋白食物」或「幫我分析今日飲食」，我可以給你更精確的建議！`;
};

const AICoach: React.FC<Props> = ({ meals }) => {
  const [chat, setChat] = useState<Message[]>([
    { role: 'ai', text: '你好！我是 CofitPlus 營養助理。我會根據你的飲食紀錄分析今日狀況，也可以回答各種飲食問題。\n\n有什麼想問的嗎？' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [chat]);

  const handleSend = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setChat(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setChat(prev => [...prev, { role: 'ai', text: getAutoResponse(msg, meals) }]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* 頭部 */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg">營養助理</h2>
            <p className="text-emerald-100 text-xs">根據你的飲食紀錄提供個人化建議</p>
          </div>
        </div>
        {meals.length > 0 && (
          <div className="mt-4 bg-white/15 rounded-2xl px-4 py-2 text-sm">
            今日已記錄 {meals.length} 餐 ·
            共 <span className="font-black">{meals.reduce((s, m) => s + m.calories, 0)}</span> kcal
          </div>
        )}
      </div>

      {/* 快速問題 */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {QUICK_REPLIES.map(q => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            className="whitespace-nowrap text-xs font-semibold bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-full shadow-sm hover:border-emerald-300 hover:text-emerald-600 transition-colors active:scale-95 flex-shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* 對話 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0" style={{ maxHeight: '45vh' }}>
        {chat.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'ai'
                ? 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-none'
                : 'bg-emerald-500 text-white shadow-md rounded-br-none'
            }`}>
              {msg.role === 'ai' && (
                <div className="flex items-center gap-1 mb-1 text-emerald-600 font-bold text-[10px] uppercase tracking-wider">
                  <Bot size={12} /> <Sparkles size={10} /> Cofit Coach
                </div>
              )}
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-2">
              <div className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75" />
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-150" />
            </div>
          </div>
        )}
      </div>

      {/* 輸入框 */}
      <div className="sticky bottom-0 bg-slate-50 py-2">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="詢問飲食建議..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm text-sm"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 text-white p-2.5 rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
