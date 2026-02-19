'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { SessionState } from '@/lib/storage/constants';

interface SettingsSheetProps {
  session: SessionState;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateTeam: (
    teamId: string,
    updates: { name?: string; color?: string | null }
  ) => void;
  onAddTeam: (name: string, color: string | null) => void;
  onRemoveTeam: (teamId: string) => void;
  onResetSession: () => void;
}

export default function SettingsSheet({
  session,
  open,
  onOpenChange,
  onUpdateTeam,
  onAddTeam,
  onRemoveTeam,
  onResetSession,
}: SettingsSheetProps) {
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamColor, setNewTeamColor] = useState('#6366f1');
  const [newTeamNoColor, setNewTeamNoColor] = useState(false);

  const defaultNewTeamName = `Team ${session.teams.length + 1}`;

  const isOnField = (teamId: string) =>
    session.onField.aTeamId === teamId || session.onField.bTeamId === teamId;

  const canRemoveTeam = (teamId: string) => {
    if (session.teams.length <= 3) return false;
    if (isOnField(teamId)) return false;
    return true;
  };

  const handleAddTeam = () => {
    const name = newTeamName.trim() || `Team ${session.teams.length + 1}`;
    const color = newTeamNoColor ? null : newTeamColor;
    onAddTeam(name, color);
    setNewTeamName('');
    setNewTeamColor('#6366f1');
    setNewTeamNoColor(false);
  };

  const handleResetSession = () => {
    const confirmed = window.confirm(
      'This will erase the current session. Continue?'
    );
    if (confirmed) {
      onResetSession();
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[540px] flex flex-col p-0"
      >
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Manage teams and session</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 max-h-[calc(100vh-120px)]">
          {/* Edit Teams section */}
          <section>
            <h3 className="text-sm font-medium text-foreground mb-3">Teams</h3>
            <div className="space-y-3">
              {session.teams.map((team) => {
                const onField = isOnField(team.id);
                const removable = canRemoveTeam(team.id);
                return (
                  <div
                    key={team.id}
                    className="rounded-lg border border-border bg-card p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant={onField ? 'default' : 'secondary'}
                      >
                        {onField ? 'On Field' : 'Queue'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-destructive disabled:opacity-50"
                        disabled={!removable}
                        onClick={() => removable && onRemoveTeam(team.id)}
                        title={
                          session.teams.length <= 3
                            ? 'Minimum 3 teams required'
                            : onField
                              ? 'Remove teams from field first'
                              : 'Remove team'
                        }
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    <input
                      type="text"
                      value={team.name}
                      onChange={(e) =>
                        onUpdateTeam(team.id, { name: e.target.value })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Team name"
                    />
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={team.color ?? '#6366f1'}
                        onChange={(e) =>
                          onUpdateTeam(team.id, { color: e.target.value })
                        }
                        className="h-9 w-14 cursor-pointer rounded border border-input bg-transparent p-1"
                      />
                      <label className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Checkbox
                          checked={team.color == null}
                          onCheckedChange={(checked) =>
                            onUpdateTeam(team.id, {
                              color: checked ? null : '#6366f1',
                            })
                          }
                        />
                        No color
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Add Team section */}
          <section>
            <h3 className="text-sm font-medium text-foreground mb-3">
              Add New Team
            </h3>
            <div className="rounded-lg border border-border bg-card p-4 space-y-3">
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder={defaultNewTeamName}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={newTeamColor}
                  onChange={(e) => setNewTeamColor(e.target.value)}
                  disabled={newTeamNoColor}
                  className="h-9 w-14 cursor-pointer rounded border border-input bg-transparent p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    checked={newTeamNoColor}
                    onCheckedChange={(checked) =>
                      setNewTeamNoColor(checked === true)
                    }
                  />
                  No color
                </label>
              </div>
              <Button onClick={handleAddTeam} className="w-full">
                Add Team
              </Button>
            </div>
          </section>

          {/* Danger Zone section */}
          <section>
            <h3 className="text-sm font-medium text-destructive mb-3">
              Danger Zone
            </h3>
            <div className="rounded-lg border border-destructive bg-card p-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                This will erase the current session.
              </p>
              <Button
                variant="destructive"
                onClick={handleResetSession}
                className="w-full"
              >
                Reset Session
              </Button>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
