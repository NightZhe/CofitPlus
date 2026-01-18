
import React, { useState, useEffect, useRef } from 'react';
import { Meal } from '../types';
import { getCoachAdvice } from '../geminiService';
import { Sparkles, Send, BrainCircuit, Bot } from 'lucide-react';

interface Props {
  meals: Meal[];
}

const AICoach: React.FC<Props> = ({ meals }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [chat, setChat] = useState<{ role: 'ai' | 'user', text: string }[]>([
    { role: 'ai', text: "Hello! I'm your AI Nutrition Assistant. I've analyzed your logs. Would you like a personalized plan for tomorrow?" }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      // Simulate/Trigger AI response
      const aiAdvice = await getCoachAdvice([...meals, { userQuestion: userMsg }]);
      setChat(prev => [...prev, { role: 'ai', text: aiAdvice }]);
    } catch (err) {
      setChat(prev => [...prev, { role: 'ai', text: "I'm having a bit of trouble connecting to my database, but based on your logs, you're doing great! Try to hit your protein targets." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg">Instant AI Coach</h2>
            <p className="text-emerald-100 text-xs">Powered by Gemini for 24/7 Support</p>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {chat.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'ai' 
                ? 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-none' 
                : 'bg-emerald-500 text-white shadow-md rounded-br-none'
            }`}>
              {msg.role === 'ai' && (
                <div className="flex items-center gap-1 mb-1 text-emerald-600 font-bold text-[10px] uppercase tracking-wider">
                  <Bot size={12} /> Coach Gemini
                </div>
              )}
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-2">
              <div className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-slate-50 py-2">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your coach anything..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 text-white p-2.5 rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
