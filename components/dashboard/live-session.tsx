// components/dashboard/live-session.tsx

'use client';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { SessionState, Team } from '@/lib/storage/constants';

interface LiveSessionProps {
  session: SessionState;
  onStartNewSession: () => void;
}

export default function LiveSession({ session, onStartNewSession }: LiveSessionProps) {
  // Create teamMap lookup for O(1) team resolution
  const teamMap: Record<string, Team> = {};
  session.teams.forEach((team) => {
    teamMap[team.id] = team;
  });

  // Resolve onField team IDs to Team objects
  const aTeam = teamMap[session.onField.aTeamId];
  const bTeam = teamMap[session.onField.bTeamId];

  // Resolve queue IDs to Team objects
  const queueTeams = session.queue.map(teamId => teamMap[teamId]);

  // Helper function to generate team abbreviation
  const getTeamAbbreviation = (teamName: string): string => {
    const words = teamName.trim().split(/\s+/);
    if (words.length === 1) {
      // Single word: take first 2 letters (e.g., "Red" -> "RE")
      return teamName.substring(0, 2).toUpperCase();
    }
    // Multiple words: take first letter of each word (e.g., "Team 1" -> "T1")
    return words.map((w) => w[0]).join('').toUpperCase();
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-6 space-y-5">
      {/* Header */}
      <header className="text-center space-y-1">
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Session view (coming soon)</p>

        {/* Start New Session button */}
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={onStartNewSession}
        >
          Start New Session
        </Button>
      </header>

      {/* Match Card */}
      <section className="bg-card border border-border rounded-2xl p-5">
        <div className="text-center text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Current Match
        </div>
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div 
              className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${
                !aTeam.color ? 'bg-primary text-primary-foreground' : ''
              }`}
              style={aTeam.color ? {
                backgroundColor: aTeam.color,
                color: '#ffffff',
              } : undefined}
            >
              {getTeamAbbreviation(aTeam.name)}
            </div>
            <div className="mt-2 text-sm font-semibold text-foreground">
              {aTeam.name}
            </div>
          </div>
          <div className="text-2xl font-bold text-muted-foreground px-4">
            vs
          </div>
          <div className="text-center flex-1">
            <div 
              className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${
                !bTeam.color ? 'bg-secondary text-secondary-foreground' : ''
              }`}
              style={bTeam.color ? {
                backgroundColor: bTeam.color,
                color: '#ffffff',
              } : undefined}
            >
              {getTeamAbbreviation(bTeam.name)}
            </div>
            <div className="mt-2 text-sm font-semibold text-foreground">
              {bTeam.name}
            </div>
          </div>
        </div>
      </section>

      {/* Queue Section */}
      <section>
        <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
          Up Next
        </div>
        {queueTeams.length === 0 ? (
          <p className="text-xs text-muted-foreground">No teams in queue</p>
        ) : (
          <Carousel
            opts={{
              align: 'start',
              loop: false,
            }}
            className="w-full bg-card rounded-2xl p-2 border border-border"
          >
            <CarouselContent className="p-2">
              {queueTeams.map((team, i) => (
                <CarouselItem key={team.id} className="pl-2 basis-auto">
                  <div
                    className={`min-w-[120px] py-2 rounded-xl text-center text-sm font-semibold border shadow-md ${
                      i === 0
                        ? 'bg-primary/10 text-primary border-primary/30'
                        : 'bg-card text-muted-foreground border-border'
                    }`}
                  >
                    {team.name}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-10 size-8 bg-card shadow-md hover:bg-accent" />
            <CarouselNext className="-right-10 size-8 bg-card shadow-md hover:bg-accent" />
          </Carousel>
        )}
      </section>

      {/* Action Buttons */}
      <section className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="default" size="lg" className="rounded-xl" disabled>
            Winner: {aTeam.name}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="rounded-xl"
            disabled
          >
            Winner: {bTeam.name}
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
  );
}
