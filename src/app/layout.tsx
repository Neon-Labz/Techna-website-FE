import type { Metadata } from 'next';
import '../index.css';

export const metadata: Metadata = {
  title: 'Techna Technical Institute',
  description: 'A/L Technology Stream – Smart Thinking Leads To Innovate',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}