'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/config';
import { saveSession } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@chouse.local');
  const [fullName, setFullName] = useState('C House Admin');
  const [error, setError] = useState('');
  const router = useRouter();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fullName,
          googleId: `mock-${crypto.randomUUID()}`,
          idToken: 'mock-id-token',
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      saveSession(data.accessToken, data.user);
      router.push('/dashboard');
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Login failed');
    }
  }

  return (
    <div style={{ maxWidth: 460, margin: '80px auto', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
      <h1>C House Admin Login</h1>
      <p style={{ margin: '8px 0 16px' }}>Google Sign-In placeholder flow for MVP.</p>
      <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" required />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required />
        <button type="submit">Sign in with Google (Mock)</button>
      </form>
      {error ? <p style={{ color: 'crimson', marginTop: 12 }}>{error}</p> : null}
    </div>
  );
}
