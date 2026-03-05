import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* CTA Section */}
      <div className="bg-gradient-to-br from-[#1E2B3D] to-[#0B1220] py-20 lg:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#0EA8D8]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#61C6E3]/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
            Ready to run fair
            <span className="block text-[#0EA8D8]">pickup games?</span>
          </h2>
          <p className="text-lg text-[#5B6B84] mb-10 max-w-2xl mx-auto">
            No signup. No download. Just open Nexturno on your phone and start tracking rotations in seconds.
          </p>
          <Button 
            size="lg" 
            className="bg-[#0EA8D8] hover:bg-[#0BA6D6] text-white shadow-xl shadow-[#0EA8D8]/30 px-10 h-14 text-base font-semibold group"
          >
            Start Your First Session
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
      
      {/* Footer Links */}
      <div className="bg-[#0B1220] border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E2B3D] to-[#233041] flex items-center justify-center border border-white/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M7 4L12 8L7 12" stroke="#0EA8D8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 12L12 16L17 20" stroke="#61C6E3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-white font-semibold">Nexturno</span>
            </div>
            
            {/* Links */}
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-[#5B6B84] hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-[#5B6B84] hover:text-white transition-colors">Contact</a>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                <button className="text-white text-xs font-medium px-2 py-0.5 rounded bg-white/10">EN</button>
                <button className="text-[#5B6B84] text-xs font-medium px-2 py-0.5 rounded hover:text-white transition-colors">ES</button>
              </div>
            </div>
            
            {/* Copyright */}
            <p className="text-[#5B6B84] text-sm">
              © 2026 Nexturno. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}