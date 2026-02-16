// components/header.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Star } from 'lucide-react';
import { hasActiveSession } from '@/lib/storage/loader';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Screens', href: '#screens' },
  { label: 'FAQ', href: '#faq' },
];

export default function Header() {
  const [hasSession, setHasSession] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHasSession(hasActiveSession());
    setIsLoading(false);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Left Section: Logo & Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Star className="size-5 fill-primary text-primary" />
          </div>
          <span className="text-xl font-bold">Nexturno</span>
        </Link>

        {/* Center Section: Navigation Links (Desktop) */}
        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section: Action Buttons & Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Desktop Action Buttons */}
          {!isLoading && (
            <>
              {hasSession && (
                <Button
                  variant="outline"
                  className="hidden md:inline-flex"
                  asChild
                >
                  <Link href="/dashboard">Continue Session</Link>
                </Button>
              )}
              <Button className="hidden md:inline-flex" asChild>
                <Link href={hasSession ? '/dashboard' : '/setup'}>
                  Start Session
                </Link>
              </Button>
            </>
          )}

          {/* Mobile CTA Button */}
          {!isLoading && (
            <Button className="md:hidden" asChild>
              <Link href={hasSession ? '/dashboard' : '/setup'}>
                Start Session
              </Link>
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="size-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="right" className="w-[280px] sm:w-[320px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          {/* Navigation Links */}
          <nav className="mt-8 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          {!isLoading && (
            <div className="mt-8 space-y-3">
              {hasSession && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard">Continue Session</Link>
                </Button>
              )}
              <Button className="w-full" asChild>
                <Link href={hasSession ? '/dashboard' : '/setup'}>
                  Start Session
                </Link>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </header>
  );
}
