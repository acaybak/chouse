'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  phoneVerified: boolean;
  role: { name: string };
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<User[]>('/users')
      .then(setUsers)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section>
      <h2>Users</h2>
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      <table style={{ width: '100%', marginTop: 12 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.role?.name}</td>
              <td>{user.phone ?? '-'} ({user.phoneVerified ? 'verified' : 'unverified'})</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
