// app/dashboard/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { hasActiveSession } from '@/lib/storage/loader';
import { clearSessionStorage, createNewSession } from '@/lib/storage/writer';
import SetupForm from '@/components/dashboard/setup-form';
import LiveSession from '@/components/dashboard/live-session';

export default function DashboardPage() {
  const [isNewSession, setIsNewSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const active = hasActiveSession();
    if (!active) {
      createNewSession();
      setIsNewSession(true);
    } else {
      setIsNewSession(false);
    }
    setIsLoading(false);
  }, []);

  const handleStartNewSession = () => {
    const confirmed = window.confirm(
      'This will wipe the current session. Continue?'
    );

    if (confirmed) {
      clearSessionStorage();
      createNewSession();
      setIsNewSession(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // New session: show setup/settings placeholder (no game UI yet)
  if (isNewSession) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-5 py-12 space-y-8">
          <header className="text-center space-y-1">
            <h1 className="text-2xl font-semibold text-foreground">
              Set up your game
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure settings for this session
            </p>
          </header>

          <section className="border border-border rounded-2xl p-6 bg-card space-y-6">
            <SetupForm />
          </section>
        </div>
      </div>
    );
  }

  // Resumed session: show live session UI
  return (
    <div className="min-h-screen bg-background">
      <LiveSession onStartNewSession={handleStartNewSession} />
    </div>
  );
}
