import React from 'react';
import { ArrowRight, Plus, Check } from 'lucide-react';

export default function Screens() {
  return (
    <section id="screens" className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 bg-white" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#0EA8D8]/10 text-[#0EA8D8] text-sm font-semibold rounded-full mb-4">
            Preview
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B1220] tracking-tight">
            Clean, focused
            <span className="block text-[#5B6B84]">mobile-first design</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {/* Screen 1: Start/Continue */}
          <div className="group">
            <div className="relative bg-gradient-to-br from-[#F7FAFF] to-white rounded-3xl border border-[#E6EEF7] p-6 shadow-lg group-hover:shadow-xl group-hover:shadow-[#0EA8D8]/10 transition-all duration-300">
              <div className="text-xs font-semibold text-[#5B6B84] mb-4 uppercase tracking-wider">Landing Screen</div>
              
              <div className="bg-white rounded-2xl border border-[#E6EEF7] p-5 shadow-sm">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E2B3D] to-[#233041] mx-auto flex items-center justify-center mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M7 4L12 8L7 12" stroke="#0EA8D8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 12L12 16L17 20" stroke="#61C6E3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-[#0B1220]">Nexturno</h3>
                  <p className="text-xs text-[#5B6B84] mt-1">Pickup rotation tracker</p>
                </div>
                
                <div className="space-y-3">
                  <button className="w-full py-3 rounded-xl bg-[#0EA8D8] text-white text-sm font-semibold flex items-center justify-center gap-2">
                    Start New Session
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="w-full py-3 rounded-xl bg-[#F7FAFF] text-[#5B6B84] text-sm font-medium border border-[#E6EEF7]">
                    Continue Session
                  </button>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-[#5B6B84] mt-4 font-medium">Start or resume</p>
          </div>
          
          {/* Screen 2: Setup Modal */}
          <div className="group">
            <div className="relative bg-gradient-to-br from-[#F7FAFF] to-white rounded-3xl border border-[#E6EEF7] p-6 shadow-lg group-hover:shadow-xl group-hover:shadow-[#0EA8D8]/10 transition-all duration-300">
              <div className="text-xs font-semibold text-[#5B6B84] mb-4 uppercase tracking-wider">Setup Modal</div>
              
              <div className="bg-white rounded-2xl border border-[#E6EEF7] p-5 shadow-sm">
                <h3 className="text-base font-bold text-[#0B1220] mb-4">Create Teams</h3>
                
                <div className="space-y-2 mb-4">
                  {['Team A', 'Team B', 'Team C'].map((team, i) => (
                    <div key={team} className="flex items-center gap-3 p-2.5 bg-[#F7FAFF] rounded-xl border border-[#E6EEF7]">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0EA8D8] to-[#61C6E3] flex items-center justify-center text-white text-sm font-bold">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-sm text-[#0B1220]">{team}</span>
                      <Check className="w-4 h-4 text-[#0EA8D8] ml-auto" />
                    </div>
                  ))}
                </div>
                
                <button className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#E6EEF7] text-[#5B6B84] text-sm font-medium flex items-center justify-center gap-2 hover:border-[#0EA8D8] hover:text-[#0EA8D8] transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Team
                </button>
              </div>
            </div>
            <p className="text-center text-sm text-[#5B6B84] mt-4 font-medium">Quick team setup</p>
          </div>
          
          {/* Screen 3: Live Session */}
          <div className="group">
            <div className="relative bg-gradient-to-br from-[#F7FAFF] to-white rounded-3xl border border-[#E6EEF7] p-6 shadow-lg group-hover:shadow-xl group-hover:shadow-[#0EA8D8]/10 transition-all duration-300">
              <div className="text-xs font-semibold text-[#5B6B84] mb-4 uppercase tracking-wider">Live Session</div>
              
              <div className="bg-white rounded-2xl border border-[#E6EEF7] p-4 shadow-sm">
                {/* Mini match card */}
                <div className="flex items-center justify-between mb-4 p-3 bg-[#F7FAFF] rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0EA8D8] text-white flex items-center justify-center text-sm font-bold">A</div>
                    <span className="text-xs font-medium text-[#0B1220]">vs</span>
                    <div className="w-8 h-8 rounded-lg bg-[#1E2B3D] text-white flex items-center justify-center text-sm font-bold">B</div>
                  </div>
                  <span className="text-xs text-[#5B6B84]">Game 3</span>
                </div>
                
                {/* Queue */}
                <div className="flex gap-2 mb-4">
                  {['C', 'D', 'E'].map((t, i) => (
                    <div key={t} className={`flex-1 py-1.5 rounded-lg text-center text-xs font-semibold ${
                      i === 0 ? 'bg-[#0EA8D8]/10 text-[#0EA8D8]' : 'bg-[#F7FAFF] text-[#5B6B84]'
                    }`}>
                      {t}
                    </div>
                  ))}
                </div>
                
                {/* Action buttons mini */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="py-2 rounded-lg bg-[#0EA8D8] text-white text-xs font-semibold text-center">A Wins</div>
                  <div className="py-2 rounded-lg bg-[#1E2B3D] text-white text-xs font-semibold text-center">B Wins</div>
                  <div className="py-2 rounded-lg bg-[#F7FAFF] text-[#5B6B84] text-xs font-medium text-center border border-[#E6EEF7]">Tie</div>
                  <div className="py-2 rounded-lg bg-[#F7FAFF] text-[#5B6B84] text-xs font-medium text-center border border-[#E6EEF7]">Undo</div>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-[#5B6B84] mt-4 font-medium">Live match tracking</p>
          </div>
        </div>
      </div>
    </section>
  );
}