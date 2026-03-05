import React from 'react';
import { Smartphone, Trophy, Users, RotateCcw, CloudOff, Zap } from 'lucide-react';

const features = [
  {
    icon: Smartphone,
    title: 'One device, one scorekeeper',
    description: 'No need for everyone to download an app. One person tracks it all on their phone.',
  },
  {
    icon: Trophy,
    title: 'Smart winner/tie rules',
    description: 'Winner stays, loser rotates out. Special 3-team tie logic with quick decision prompts.',
  },
  {
    icon: Users,
    title: 'Queue always visible',
    description: 'Everyone knows who\'s up next. No confusion, no debates about whose turn it is.',
  },
  {
    icon: RotateCcw,
    title: 'Undo mistakes (up to 3)',
    description: 'Tapped the wrong button? No problem. Roll back up to 3 moves instantly.',
  },
  {
    icon: CloudOff,
    title: 'Local-first, refresh-safe',
    description: 'Works offline, survives refreshes. Your session persists for 24 hours.',
  },
  {
    icon: Zap,
    title: 'Multi-sport ready',
    description: 'Built for soccer now, but designed for basketball, volleyball, and more.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 bg-white" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#0EA8D8]/10 text-[#0EA8D8] text-sm font-semibold rounded-full mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B1220] tracking-tight">
            Everything you need,
            <span className="block text-[#5B6B84]">nothing you don't</span>
          </h2>
          <p className="mt-6 text-lg text-[#5B6B84]">
            Built by players, for players. We focused on what actually matters during a pickup game.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-2xl border border-[#E6EEF7] p-8 hover:border-[#0EA8D8]/30 hover:shadow-xl hover:shadow-[#0EA8D8]/10 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0EA8D8]/10 to-[#61C6E3]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-[#0EA8D8]" />
              </div>
              
              <h3 className="text-xl font-semibold text-[#0B1220] mb-3">
                {feature.title}
              </h3>
              
              <p className="text-[#5B6B84] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}