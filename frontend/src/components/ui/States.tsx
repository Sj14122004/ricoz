import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

export const Spinner = () => (
  <div className="flex justify-center py-16" role="status" aria-label="Loading">
    <Loader2 className="h-6 w-6 animate-spin text-night-600" />
  </div>
);

export const ErrorNote = ({ message }: { message: string }) => (
  <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{message}</p>
);

export const EmptyState = ({ title, children }: { title: string; children?: ReactNode }) => (
  <div className="panel py-14 text-center">
    <p className="font-display text-lg text-night">{title}</p>
    <div className="mt-3 flex justify-center text-sm text-slate-600">{children}</div>
  </div>
);
