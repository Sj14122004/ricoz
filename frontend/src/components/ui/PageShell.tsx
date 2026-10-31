import { ReactNode } from 'react';

export default function PageShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-xl text-slate-600">{subtitle}</p>}
      <div className="mt-8">{children}</div>
    </main>
  );
}
