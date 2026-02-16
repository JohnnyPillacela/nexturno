import { Button } from "@/components/ui/button";

export default function DashboardPage() {
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
