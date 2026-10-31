'use client';
import Link from 'next/link';
import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { EmptyState, Spinner } from '@/components/ui/States';

export default function RequireAuth({ children, role }: { children: ReactNode; role?: 'admin' }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) {
    return (
      <EmptyState title="Log in to continue">
        <Link href="/login" className="btn-primary">Log in</Link>
      </EmptyState>
    );
  }
  if (role && user.role !== role) return <EmptyState title="This page is for admins only" />;
  return <>{children}</>;
}
