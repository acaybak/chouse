'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { clearSession, getToken } from '@/lib/auth';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/users', label: 'Users' },
  { href: '/cashiers', label: 'Cashiers' },
  { href: '/add-points', label: 'Add Points' },
  { href: '/menu', label: 'Menu Management' },
  { href: '/notifications', label: 'Notifications' },
];

export function ProtectedShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
      <aside style={{ padding: 16, borderRight: '1px solid #ddd' }}>
        <h1 style={{ marginBottom: 12 }}>C House POS</h1>
        <nav style={{ display: 'grid', gap: 8 }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                background: pathname === link.href ? '#ffe4b5' : '#f6f6f6',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          style={{ marginTop: 16, padding: '8px 12px', width: '100%' }}
          onClick={() => {
            clearSession();
            router.push('/login');
          }}
        >
          Logout
        </button>
      </aside>
      <main style={{ padding: 20 }}>{children}</main>
    </div>
  );
}
