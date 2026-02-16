// components/dashboard/setup-form.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSession } from '@/lib/storage/session';
import { saveSession } from '@/lib/storage/writer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const COLOR_OPTIONS = [
  'No Color',
  'Red',
  'Blue',
  'Yellow',
  'Green',
  'Orange',
  'Purple',
  'Pink',
  'Lime',
] as const;

export default function SetupForm() {
  const [goalCap, setGoalCap] = useState<string>('');
  const [teamCount, setTeamCount] = useState<string>('4');
  const [teamColors, setTeamColors] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const numTeams = parseInt(teamCount, 10) || 4;

  const updateTeamColor = (teamIndex: number, value: string) => {
    setTeamColors((prev) => ({ ...prev, [teamIndex]: value }));
  };

  const handleStartMatch = () => {
    setIsSubmitting(true);

    try {
      const sessionState = createSession({
        teamCount: numTeams,
        goalCap: goalCap ? parseInt(goalCap, 10) : null,
        teamColors,
      });

      saveSession(sessionState);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error starting match:', error);
      alert('Failed to start match. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 space-y-8">
      <header className="text-center space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          Start New Session
        </h1>
        <p className="text-sm text-muted-foreground">
          Set up your pickup soccer game rules and teams.
        </p>
      </header>

      {/* Rules */}
      <section className="border border-border rounded-2xl p-6 bg-card space-y-6">
        <h2 className="text-lg font-semibold text-foreground">Rules</h2>

        <div className="space-y-2">
          <Label className="text-muted-foreground">
            Goal Cap (Goals needed to win)
          </Label>
          <Select value={goalCap} onValueChange={setGoalCap}>
            <SelectTrigger className="w-full h-10 rounded-lg">
              <SelectValue placeholder="Select goal cap" />
            </SelectTrigger>
            <SelectContent>
              {[1, 3, 5].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} {n === 1 ? 'Goal' : 'Goals'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            First team to score this many goals wins the match
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox id="timer" disabled />
            <Label htmlFor="timer" className="text-muted-foreground opacity-50">
              Use Timer (Coming Soon)
            </Label>
          </div>
          <p className="text-xs text-muted-foreground opacity-50">
            Timer feature temporarily disabled. Use a phone timer for now.
          </p>
        </div>
      </section>

      {/* Teams */}
      <section className="border border-border rounded-2xl p-6 bg-card space-y-6">
        <h2 className="text-lg font-semibold text-foreground">Teams</h2>

        <div className="space-y-2">
          <Label className="text-muted-foreground">Number of Teams</Label>
          <Select value={teamCount} onValueChange={setTeamCount}>
            <SelectTrigger className="w-full h-10 rounded-lg">
              <SelectValue placeholder="Select number of teams" />
            </SelectTrigger>
            <SelectContent>
              {[2, 3, 4, 5, 6, 8].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} Teams
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: numTeams }, (_, i) => (
            <div key={i} className="space-y-2">
              <Label className="text-muted-foreground">Team {i + 1}:</Label>
              <Select
                value={teamColors[i] ?? 'no-color'}
                onValueChange={(v) => updateTeamColor(i, v)}
              >
                <SelectTrigger className="w-full h-10 rounded-lg">
                  <SelectValue placeholder="No Color" />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map((color) => (
                    <SelectItem
                      key={color}
                      value={color.toLowerCase().replace(' ', '-')}
                    >
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </section>

      {/* Initial Order */}
      <section className="border border-border rounded-2xl p-6 bg-card space-y-6">
        <h2 className="text-lg font-semibold text-foreground">
          Initial Order
        </h2>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {Array.from({ length: numTeams }, (_, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                #{i + 1}
              </span>
              {i < numTeams - 1 && (
                <span className="text-muted-foreground">→</span>
              )}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">
          First two teams will start on the field.
        </p>
      </section>

      {/* Action buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="lg" className="rounded-xl" asChild>
          <Link href="/">Cancel</Link>
        </Button>
        <Button
          size="lg"
          className="rounded-xl"
          onClick={handleStartMatch}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Starting...' : 'Start Match'}
        </Button>
      </div>
    </div>
  );
}
