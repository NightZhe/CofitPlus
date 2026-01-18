
import React from 'react';
import { Heart, MessageCircle, Share2, Award } from 'lucide-react';

const Community: React.FC = () => {
  const posts = [
    {
      id: 1,
      user: 'Sarah Miller',
      avatar: 'https://picsum.photos/id/64/100/100',
      time: '2h ago',
      content: 'Just finished my first 7-day keto streak with Cofit! Feeling amazing. 🥗✨',
      image: 'https://picsum.photos/id/102/600/400',
      likes: 24,
      comments: 5
    },
    {
      id: 2,
      user: 'Jason Chen',
      avatar: 'https://picsum.photos/id/65/100/100',
      time: '4h ago',
      content: 'Who else hit their step goal today? 👟 Let\'s go 8-Week Challenge group!',
      image: 'https://picsum.photos/id/342/600/400',
      likes: 42,
      comments: 12
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {['All Feed', 'My Group', 'Challenges', 'Success Stories'].map((cat, i) => (
          <button 
            key={cat} 
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-all ${i === 0 ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-500'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-emerald-600 rounded-3xl p-6 text-white flex items-center justify-between shadow-xl">
        <div>
          <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
            <Award size={20} className="text-emerald-300" />
            Weekly Leaderboard
          </h3>
          <p className="text-emerald-100 text-xs">You are currently #4 in your group</p>
        </div>
        <button className="bg-white/20 px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md">View</button>
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={post.avatar} className="w-10 h-10 rounded-full border-2 border-emerald-500" alt={post.user} />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{post.user}</h4>
                  <p className="text-[10px] text-slate-400">{post.time}</p>
                </div>
              </div>
              <button className="text-slate-300 hover:text-slate-500">•••</button>
            </div>
            
            <div className="px-4 pb-3">
              <p className="text-sm text-slate-700 leading-relaxed">{post.content}</p>
            </div>

            <img src={post.image} className="w-full h-64 object-cover" alt="Post" />

            <div className="p-4 flex items-center justify-between border-t border-slate-50">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors">
                  <Heart size={20} />
                  <span className="text-xs font-bold">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-500 transition-colors">
                  <MessageCircle size={20} />
                  <span className="text-xs font-bold">{post.comments}</span>
                </button>
              </div>
              <button className="text-slate-500 hover:text-blue-500">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
