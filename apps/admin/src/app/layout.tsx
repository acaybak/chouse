import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'C House Admin POS',
  description: 'C House admin and cashier panel',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
