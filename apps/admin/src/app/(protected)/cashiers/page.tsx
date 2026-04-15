'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

type Cashier = { id: string; fullName: string; email: string; phone: string | null };

export default function CashiersPage() {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [error, setError] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+905551112233');

  async function loadCashiers() {
    try {
      const data = await apiFetch<Cashier[]>('/users/cashiers');
      setCashiers(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load cashiers');
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadCashiers();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  async function createCashier(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      await apiFetch('/users/cashiers', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, phone }),
      });
      setFullName('');
      setEmail('');
      await loadCashiers();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create cashier');
    }
  }

  return (
    <section>
      <h2>Cashiers / Garson Yönetimi</h2>
      <form onSubmit={createCashier} style={{ display: 'grid', gap: 8, maxWidth: 420, marginTop: 10 }}>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" required />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" required />
        <button type="submit">Add Cashier</button>
      </form>
      {error ? <p style={{ color: 'crimson', marginTop: 8 }}>{error}</p> : null}
      <ul style={{ marginTop: 16 }}>
        {cashiers.map((cashier) => (
          <li key={cashier.id}>{cashier.fullName} - {cashier.email} - {cashier.phone ?? '-'}</li>
        ))}
      </ul>
    </section>
  );
}
