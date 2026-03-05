import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 lg:pt-40 pb-20 lg:pb-32 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F7FAFF] to-[#F3F8FF]" />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#0EA8D8]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#61C6E3]/8 rounded-full blur-3xl translate-x-1/3" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#E6EEF7] shadow-sm mb-6">
              <span className="w-2 h-2 bg-[#0EA8D8] rounded-full animate-pulse" />
              <span className="text-sm font-medium text-[#5B6B84]">Now tracking soccer • More sports coming</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0B1220] leading-tight tracking-tight">
              Next team up.
              <span className="block text-[#0EA8D8]">Instantly.</span>
            </h1>
            
            <p className="mt-6 text-lg lg:text-xl text-[#5B6B84] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Run pickup games smoothly with a single-device rotation tracker. Fair rotations, no arguing, no apps to download.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-[#0EA8D8] hover:bg-[#0BA6D6] text-white shadow-xl shadow-[#0EA8D8]/30 px-8 h-14 text-base font-semibold group"
              >
                Start Session
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-[#E6EEF7] bg-white hover:bg-[#F7FAFF] text-[#1E2B3D] h-14 text-base font-medium"
              >
                <Play className="mr-2 w-5 h-5 text-[#0EA8D8]" />
                See how it works
              </Button>
            </div>
            
            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-sm text-[#5B6B84]">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#0EA8D8]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>No account needed</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#0EA8D8]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Works offline</span>
              </div>
            </div>
          </div>
          
          {/* Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0EA8D8]/20 to-[#61C6E3]/20 rounded-[3rem] blur-2xl scale-110" />
              
              {/* Phone frame */}
              <div className="relative bg-[#1E2B3D] rounded-[3rem] p-3 shadow-2xl shadow-[#1E2B3D]/30">
                <div className="bg-white rounded-[2.5rem] overflow-hidden w-[280px] sm:w-[320px]">
                  {/* Status bar */}
                  <div className="bg-[#F7FAFF] px-6 py-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-[#5B6B84]">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 bg-[#0B1220] rounded-sm" />
                    </div>
                  </div>
                  
                  {/* App content */}
                  <div className="px-5 py-6 space-y-5">
                    {/* Match Card */}
                    <div className="bg-gradient-to-br from-[#F7FAFF] to-white rounded-2xl border border-[#E6EEF7] p-5 shadow-sm">
                      <div className="text-center text-xs font-medium text-[#5B6B84] mb-4">CURRENT MATCH</div>
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0EA8D8] to-[#61C6E3] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#0EA8D8]/30">
                            A
                          </div>
                          <div className="mt-2 text-sm font-semibold text-[#0B1220]">Team A</div>
                        </div>
                        <div className="text-2xl font-bold text-[#5B6B84]">vs</div>
                        <div className="text-center">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E2B3D] to-[#233041] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#1E2B3D]/30">
                            B
                          </div>
                          <div className="mt-2 text-sm font-semibold text-[#0B1220]">Team B</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Queue */}
                    <div>
                      <div className="text-xs font-medium text-[#5B6B84] mb-2">UP NEXT</div>
                      <div className="flex gap-2">
                        {['C', 'D', 'E'].map((team, i) => (
                          <div 
                            key={team}
                            className={`flex-1 py-2 rounded-xl text-center text-sm font-semibold ${
                              i === 0 
                                ? 'bg-[#0EA8D8]/10 text-[#0EA8D8] border-2 border-[#0EA8D8]/30' 
                                : 'bg-[#F7FAFF] text-[#5B6B84] border border-[#E6EEF7]'
                            }`}
                          >
                            {team}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <button className="py-3 rounded-xl bg-[#0EA8D8] text-white text-sm font-semibold shadow-lg shadow-[#0EA8D8]/30">
                          Winner A
                        </button>
                        <button className="py-3 rounded-xl bg-[#1E2B3D] text-white text-sm font-semibold shadow-lg shadow-[#1E2B3D]/30">
                          Winner B
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="py-3 rounded-xl bg-[#F7FAFF] text-[#5B6B84] text-sm font-semibold border border-[#E6EEF7]">
                          Tie
                        </button>
                        <button className="py-3 rounded-xl bg-[#F7FAFF] text-[#5B6B84] text-sm font-semibold border border-[#E6EEF7]">
                          Undo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}