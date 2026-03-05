import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Screens', href: '#screens' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E6EEF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E2B3D] to-[#233041] flex items-center justify-center shadow-lg shadow-[#0EA8D8]/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 4L12 8L7 12" stroke="#0EA8D8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 12L12 16L17 20" stroke="#61C6E3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V16" stroke="#0EA8D8" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-[#0B1220] tracking-tight">Nexturno</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#5B6B84] hover:text-[#0B1220] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" className="text-[#5B6B84] hover:text-[#0B1220] hover:bg-[#F7FAFF]">
              Continue Session
            </Button>
            <Button className="bg-[#0EA8D8] hover:bg-[#0BA6D6] text-white shadow-lg shadow-[#0EA8D8]/30 px-6">
              Start Session
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1E2B3D]"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#E6EEF7]">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-3 text-[#5B6B84] hover:text-[#0B1220] hover:bg-[#F7FAFF] rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-4 px-4">
                <Button variant="outline" className="w-full border-[#E6EEF7] text-[#5B6B84]">
                  Continue Session
                </Button>
                <Button className="w-full bg-[#0EA8D8] hover:bg-[#0BA6D6] text-white">
                  Start Session
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}