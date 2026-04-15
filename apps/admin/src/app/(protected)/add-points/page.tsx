'use client';

import { FormEvent, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function AddPointsPage() {
  const [phone, setPhone] = useState('+905550000000');
  const [walletContext, setWalletContext] = useState('bosch_dealer');
  const [amountPoints, setAmountPoints] = useState(100);
  const [amountTl, setAmountTl] = useState(100);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await apiFetch<{ wallet: { balancePoints: number; balanceTl: string } }>('/wallets/transactions', {
        method: 'POST',
        body: JSON.stringify({
          phone,
          walletContext,
          transactionType: 'earn',
          source: 'pos_checkout',
          amountPoints,
          amountTl,
          metadata: { note: 'POS add points' },
        }),
      });

      setMessage(`Updated wallet: ${response.wallet.balancePoints} pts / ${response.wallet.balanceTl} TL`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to add points');
    }
  }

  return (
    <section>
      <h2>Add Points (Kasa)</h2>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 420, marginTop: 12 }}>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Customer phone" required />
        <select value={walletContext} onChange={(e) => setWalletContext(e.target.value)}>
          <option value="bosch_dealer">Bosch Dealer Wallet</option>
          <option value="cafe_bar">Cafe/Bar Wallet</option>
        </select>
        <input type="number" value={amountPoints} onChange={(e) => setAmountPoints(Number(e.target.value))} min={1} />
        <input type="number" value={amountTl} onChange={(e) => setAmountTl(Number(e.target.value))} min={0} step="0.01" />
        <button type="submit">Create Loyalty Transaction</button>
      </form>
      {message ? <p style={{ color: 'green', marginTop: 10 }}>{message}</p> : null}
      {error ? <p style={{ color: 'crimson', marginTop: 10 }}>{error}</p> : null}
    </section>
  );
}
