'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { TextInput } from '@/components/ui/Field';
import { ErrorNote } from '@/components/ui/States';
import { useAuth } from '@/context/AuthContext';

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const { login, register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isLogin = mode === 'login';
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const user = isLogin
        ? await login(form.email, form.password)
        : await register({ name: form.name, email: form.email, password: form.password, phone: form.phone || undefined });
      router.push(user.role === 'admin' ? '/admin' : '/products');
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-14">
      <form onSubmit={submit} className="panel space-y-4">
        <h1 className="text-2xl font-bold">{isLogin ? 'Log in' : 'Create your account'}</h1>
        {!isLogin && <TextInput label="Your name" required minLength={2} value={form.name} onChange={set('name')} />}
        <TextInput label="Email" type="email" required autoComplete="email" value={form.email} onChange={set('email')} />
        {!isLogin && <TextInput label="Phone (optional)" type="tel" value={form.phone} onChange={set('phone')} />}
        <TextInput label="Password" type="password" required minLength={isLogin ? 1 : 6} hint={isLogin ? undefined : 'At least 6 characters'}
          autoComplete={isLogin ? 'current-password' : 'new-password'} value={form.password} onChange={set('password')} />
        {error && <ErrorNote message={error} />}
        <button className="btn-primary w-full !py-3" disabled={busy}>{busy ? 'Please wait…' : isLogin ? 'Log in' : 'Create account'}</button>
        <p className="text-center text-sm text-slate-600">
          {isLogin ? 'New here? ' : 'Already have an account? '}
          <Link className="font-semibold text-night underline" href={isLogin ? '/register' : '/login'}>{isLogin ? 'Create an account' : 'Log in'}</Link>
        </p>
      </form>
    </main>
  );
}
