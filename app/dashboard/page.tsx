// app/dashboard/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadSession } from '@/lib/storage/loader';
import { clearSessionStorage, saveSession } from '@/lib/storage/writer';
import { Team } from '@/lib/storage/constants';
import LiveSession from '@/components/dashboard/live-session';
import { Event } from '@/lib/events/types';
import { applyEvent } from '@/lib/events/reducer';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<ReturnType<typeof loadSession>>(null);

  useEffect(() => {
    const loaded = loadSession();

    if (!loaded) {
      // No full session - redirect to setup
      router.replace('/setup');
    } else {
      setSession(loaded);
    }

    setIsLoading(false);
  }, [router]);

  const handleStartNewSession = () => {
    const confirmed = window.confirm(
      'This will wipe the current session. Continue?'
    );

    if (confirmed) {
      clearSessionStorage();
      router.replace('/setup');
    }
  };

  const handleEvent = (event: Event) => {
    if (!session) return;

    // Apply event to get next state
    const nextState = applyEvent(session, event);

    // Persist to localStorage
    saveSession(nextState);

    // Update React state
    setSession(nextState);
  };

  const handleUpdateTeam = (
    teamId: string,
    updates: { name?: string; color?: string | null }
  ) => {
    if (!session) return;
    const updatedTeams = session.teams.map((team) =>
      team.id === teamId ? { ...team, ...updates } : team
    );
    const nextState = { ...session, teams: updatedTeams };
    saveSession(nextState);
    setSession(nextState);
  };

  const handleAddTeam = (name: string, color: string | null) => {
    if (!session) return;
    const newTeam: Team = {
      id: crypto.randomUUID(),
      name,
      color,
    };
    const nextState = {
      ...session,
      teams: [...session.teams, newTeam],
      queue: [...session.queue, newTeam.id],
    };
    saveSession(nextState);
    setSession(nextState);
  };

  const handleRemoveTeam = (teamId: string) => {
    if (!session) return;

    if (
      session.onField.aTeamId === teamId ||
      session.onField.bTeamId === teamId
    ) {
      console.error('Cannot remove on-field team');
      return;
    }
    if (session.teams.length <= 3) {
      console.error('Cannot remove: minimum 3 teams required');
      return;
    }
    const nextState = {
      ...session,
      teams: session.teams.filter((t) => t.id !== teamId),
      queue: session.queue.filter((id) => id !== teamId),
    };
    saveSession(nextState);
    setSession(nextState);
  };

  if (isLoading || !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LiveSession
        session={session}
        onStartNewSession={handleStartNewSession}
        onDispatchEvent={handleEvent}
        onUpdateTeam={handleUpdateTeam}
        onAddTeam={handleAddTeam}
        onRemoveTeam={handleRemoveTeam}
      />
    </div>
  );
}
