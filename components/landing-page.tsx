'use client';

import { useState, useEffect } from 'react';
import { hasActiveSession } from '@/lib/storage/loader';
import { Button } from '@/components/ui/button';
import { Empty } from '@/components/ui/empty';
import { ArrowRight, Check, Play } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [hasSession, setHasSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHasSession(hasActiveSession());
    setIsLoading(false);
  }, []);

  return (
    <section className="relative min-h-screen pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-background">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Hero content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">
                Now tracking soccer • More sports coming
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
              Next team up.
              <span className="block text-primary">Instantly.</span>
            </h1>

            <p className="mt-6 text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Run pickup games smoothly with a single-device rotation tracker.
              Fair rotations, no arguing, no apps to download.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/dashboard">
                <Button variant="hero" size="hero" className="group">
                  {!isLoading && hasSession ? 'Continue Session' : 'Start Session'}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="heroOutline" size="hero">
                <Play className="mr-2 w-5 h-5" />
                See how it works
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary shrink-0" />
                <span>No account needed</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary shrink-0" />
                <span>Works offline</span>
              </div>
            </div>
          </div>

          {/* Placeholder for phone mockup / future content */}
          <div className="hidden lg:flex justify-center lg:justify-end">
            <Empty className="border border-border min-h-[400px] w-full max-w-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}
