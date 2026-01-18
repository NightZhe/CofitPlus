
import React, { useState, useRef } from 'react';
import { analyzeMeal } from '../geminiService';
import { Meal } from '../types';
import { Camera, Image as ImageIcon, Search, Loader2, Sparkles, X } from 'lucide-react';

interface Props {
  onLog: (meal: Meal) => void;
}

const LogFood: React.FC<Props> = ({ onLog }) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!description && !image) return;
    setAnalyzing(true);
    try {
      const base64 = image ? image.split(',')[1] : undefined;
      const data = await analyzeMeal(description || "What is in this meal?", base64);
      setResult(data);
    } catch (err) {
      console.error(err);
      // Fallback
      setResult({
        name: description || "Uploaded Meal",
        calories: 450,
        protein: 25,
        carbs: 45,
        fat: 18,
        feedback: "Looks balanced! Great choice for a nutritious energy boost."
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const confirmLog = () => {
    if (!result) return;
    onLog({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      type: 'Lunch', // Simplified
      name: result.name,
      calories: result.calories,
      macros: {
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat
      },
      image: image || undefined,
      feedback: result.feedback
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">What's the meal?</h2>
        {result && (
          <button onClick={() => setResult(null)} className="text-slate-400 p-1">
            <X size={20} />
          </button>
        )}
      </div>

      {!result ? (
        <div className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-400 rounded-3xl blur-xl opacity-10 group-focus-within:opacity-20 transition-opacity"></div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., A chicken salad with extra avocado and seeds"
              className="w-full bg-white border border-slate-200 rounded-3xl p-6 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm relative z-10 text-lg"
            />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-white border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center gap-2 text-slate-500 hover:border-emerald-300 hover:text-emerald-600 transition-all active:scale-95"
            >
              <div className="bg-slate-50 p-3 rounded-full">
                <Camera size={24} />
              </div>
              <span className="text-xs font-bold">Snap Photo</span>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*" 
              />
            </button>
            
            <button 
              className="flex-1 bg-white border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center gap-2 text-slate-500 hover:border-emerald-300 hover:text-emerald-600 transition-all active:scale-95"
            >
              <div className="bg-slate-50 p-3 rounded-full">
                <Search size={24} />
              </div>
              <span className="text-xs font-bold">Search Food</span>
            </button>
          </div>

          {image && (
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-md group">
              <img src={image} alt="Meal preview" className="w-full h-full object-cover" />
              <button 
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <button 
            onClick={handleAnalyze}
            disabled={analyzing || (!description && !image)}
            className="w-full bg-emerald-500 text-white py-5 rounded-3xl font-bold text-lg shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50 transition-transform active:scale-95"
          >
            {analyzing ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                AI Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={24} />
                Get Instant Feedback
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            {image && <img src={image} className="w-full h-48 object-cover" alt="Meal" />}
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-1">{result.name}</h3>
              <div className="text-emerald-600 font-black text-2xl mb-4">{result.calories} kcal</div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Protein</div>
                  <div className="font-bold">{result.protein}g</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Carbs</div>
                  <div className="font-bold">{result.carbs}g</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Fat</div>
                  <div className="font-bold">{result.fat}g</div>
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl flex gap-3 border border-emerald-100">
                <Sparkles className="text-emerald-500 flex-shrink-0" size={20} />
                <p className="text-sm text-emerald-800 italic leading-relaxed">
                  "{result.feedback}"
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setResult(null)}
              className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
            >
              Adjust
            </button>
            <button 
              onClick={confirmLog}
              className="flex-[2] bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-colors"
            >
              Log This Meal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogFood;
