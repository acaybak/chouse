'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

type User = { id: string; fullName: string; email: string; role: { name: string } };

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<User[]>('/users')
      .then(setUsers)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section>
      <h2>Dashboard</h2>
      <p>Admin / kasa overview for C House.</p>
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
        <div>Total users: {users.length}</div>
        <div>Cashiers: {users.filter((user) => user.role?.name === 'cashier').length}</div>
      </div>
    </section>
  );
}
