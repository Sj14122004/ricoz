'use client';
import { Moon, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const path = usePathname();
  const router = useRouter();
  const isAdmin = user?.role === 'admin';

  const link = (href: string, label: string) => (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-white/10 ${path.startsWith(href) ? 'text-lamp' : 'text-white/80'}`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-30 bg-night/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-white">
          <Moon className="h-5 w-5 text-lamp" aria-hidden /> Night Pod
        </Link>
        <div className="flex items-center gap-1">
          {link('/products', 'Supplies')}
          {user && !isAdmin && link('/orders', 'My requests')}
          {isAdmin && link('/admin', 'Admin')}
          {!isAdmin && (
            <Link href="/request" className="relative rounded-lg p-2 text-white/80 hover:bg-white/10" aria-label={`Request, ${count} items`}>
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-lamp px-1 text-[10px] font-bold text-night">{count}</span>
              )}
            </Link>
          )}
          {user ? (
            <button
              className="ml-1 rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10"
              onClick={async () => { await logout(); router.push('/'); }}
            >
              Log out
            </button>
          ) : (
            <Link href="/login" className="btn-lamp ml-1 !px-4 !py-2">Log in</Link>
          )}
        </div>
      </nav>
    </header>
  );
}