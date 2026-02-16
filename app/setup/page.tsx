// app/setup/page.tsx

'use client';

import SetupForm from '@/components/dashboard/setup-form';

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-background">
      <SetupForm />
    </div>
  );
}
