// app/dashboard/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { hasActiveSession } from '@/lib/storage/loader';
import { clearSessionStorage, createNewSession } from '@/lib/storage/writer';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [hasSession, setHasSession] = useState(false);
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
    setHasSession(true);
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
      setHasSession(true);
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
            <h2 className="text-lg font-semibold text-foreground">
              Game settings
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground block">
                  Team count
                </label>
                <div className="h-10 rounded-lg border border-border bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground block">
                  Goal cap
                </label>
                <div className="h-10 rounded-lg border border-border bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground block">
                  Colors
                </label>
                <div className="h-10 rounded-lg border border-border bg-background" />
              </div>
            </div>
            <Button size="lg" className="rounded-xl w-full" disabled>
              Start game
            </Button>
          </section>
        </div>
      </div>
    );
  }

  // Resumed session: show live session UI
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-5 py-6 space-y-5">
        {/* Header */}
        <header className="text-center space-y-1">
          <h1 className="text-xl font-semibold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Session view (coming soon)
          </p>
          {hasSession && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={handleStartNewSession}
            >
              Start New Session
            </Button>
          )}
        </header>

        {/* Match Card */}
        <section className="bg-card border border-border rounded-2xl p-5">
          <div className="text-center text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wider">
            Current Match
          </div>
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                A
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">
                Team A
              </div>
            </div>
            <div className="text-2xl font-bold text-muted-foreground px-4">
              vs
            </div>
            <div className="text-center flex-1">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xl">
                B
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">
                Team B
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Match Card (Coming Soon)
          </p>
        </section>

        {/* Queue Section */}
        <section>
          <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Up Next
          </div>
          {/* TODO: This will probably be replaced with a carousel of the teams in the queue */}
          <div className="flex gap-2">
            {["C", "D", "E"].map((team, i) => (
              <div
                key={team}
                className={`flex-1 py-2 rounded-xl text-center text-sm font-semibold border ${
                  i === 0
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-card text-muted-foreground border-border"
                }`}
              >
                {team}
              </div>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <section className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="default" size="lg" className="rounded-xl" disabled>
              Winner A
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="rounded-xl"
              disabled
            >
              Winner B
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" className="rounded-xl" disabled>
              Tie
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl" disabled>
              Undo
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
