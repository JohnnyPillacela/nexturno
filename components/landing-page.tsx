// components/landing-page.tsx

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <h1 className="text-foreground text-4xl font-bold">Nexturno</h1>
      <button
        type="button"
        className="h-14 rounded-full bg-primary px-8 text-primary-foreground shadow-lg"
      >
        Start Session
      </button>
    </div>
  );
}
