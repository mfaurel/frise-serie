import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Frise Historique — Séries | Historical Series Timeline',
  description:
    'Découvrez l\'histoire à travers les séries télévisées. Explore history through TV series on an interactive parallax timeline.',
  keywords: ['historical series', 'séries historiques', 'timeline', 'frise chronologique', 'histoire'],
  openGraph: {
    title: 'Frise Historique — Séries',
    description: 'Une fresque interactive pour explorer l\'histoire via les séries TV.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body>{children}</body>
    </html>
  );
}
