import React from 'react';
import { Users, MousePointer, Shuffle } from 'lucide-react';

const steps = [
  {
    icon: Users,
    step: '01',
    title: 'Set up your teams',
    description: 'Add 3 or more teams. Optionally set a goal cap. That\'s it—ready in seconds.',
  },
  {
    icon: MousePointer,
    step: '02',
    title: 'Track results live',
    description: 'After each game, tap Winner A, Winner B, or Tie. One tap, done.',
  },
  {
    icon: Shuffle,
    step: '03',
    title: 'Auto rotation',
    description: 'Nexturno handles the queue. Winner stays, loser goes to back, next team steps in.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F7FAFF] to-white" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0EA8D8]/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#0EA8D8]/10 text-[#0EA8D8] text-sm font-semibold rounded-full mb-4">
            How it Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B1220] tracking-tight">
            Three steps to
            <span className="block text-[#0EA8D8]">fair rotations</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-[#E6EEF7] to-[#E6EEF7] via-[#0EA8D8]/30" />
              )}
              
              <div className="relative bg-white rounded-3xl border border-[#E6EEF7] p-8 shadow-lg shadow-[#1E2B3D]/5 hover:shadow-xl hover:shadow-[#0EA8D8]/10 transition-all duration-300">
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-[#1E2B3D] text-white flex items-center justify-center font-bold text-lg shadow-lg">
                  {step.step}
                </div>
                
                <div className="pt-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0EA8D8]/10 to-[#61C6E3]/10 flex items-center justify-center mb-6">
                    <step.icon className="w-8 h-8 text-[#0EA8D8]" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-[#0B1220] mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-[#5B6B84] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}