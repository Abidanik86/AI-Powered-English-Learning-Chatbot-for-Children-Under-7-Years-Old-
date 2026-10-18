import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'AI-Powered English Learning Chatbot for Children (Under 7 Years Old)',
  description: 'AI-Powered English Learning Chatbot for Children under 7 featuring progressive learning (L1/L2/L3), child mode detection, Social & Emotional Learning (SEL), voice interaction, and sub-2s latency.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐻</text></svg>'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
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
