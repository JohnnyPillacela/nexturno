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

  return (
    <div className="min-h-screen bg-background">
      {isNewSession ? (
        <SetupForm />
      ) : (
        <LiveSession onStartNewSession={handleStartNewSession} />
      )}
    </div>
  );
}
