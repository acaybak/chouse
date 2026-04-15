'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

type Notification = { id: string; titleTr: string; bodyTr: string; status: string };

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [titleTr, setTitleTr] = useState('Yeni kampanya');
  const [titleEn, setTitleEn] = useState('New campaign');
  const [bodyTr, setBodyTr] = useState('Bugün puanlarınız 2x!');
  const [bodyEn, setBodyEn] = useState('Your points are 2x today!');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadNotifications() {
    try {
      setNotifications(await apiFetch<Notification[]>('/notifications/my'));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load notifications');
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadNotifications();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  async function sendNotification(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      await apiFetch('/notifications', {
        method: 'POST',
        body: JSON.stringify({ titleTr, titleEn, bodyTr, bodyEn }),
      });
      setMessage('Notification sent via FCM stub.');
      await loadNotifications();
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Failed to send notification');
    }
  }

  return (
    <section>
      <h2>Notifications</h2>
      <form onSubmit={sendNotification} style={{ display: 'grid', gap: 8, maxWidth: 480, marginTop: 12 }}>
        <input value={titleTr} onChange={(e) => setTitleTr(e.target.value)} placeholder="Title TR" required />
        <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="Title EN" required />
        <textarea value={bodyTr} onChange={(e) => setBodyTr(e.target.value)} placeholder="Body TR" required rows={2} />
        <textarea value={bodyEn} onChange={(e) => setBodyEn(e.target.value)} placeholder="Body EN" required rows={2} />
        <button type="submit">Send Notification</button>
      </form>
      {message ? <p style={{ color: 'green', marginTop: 8 }}>{message}</p> : null}
      {error ? <p style={{ color: 'crimson', marginTop: 8 }}>{error}</p> : null}
      <ul style={{ marginTop: 16 }}>
        {notifications.map((notification) => (
          <li key={notification.id}>{notification.titleTr}: {notification.bodyTr} ({notification.status})</li>
        ))}
      </ul>
    </section>
  );
}
