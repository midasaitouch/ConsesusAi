import './globals.css'

export const metadata = {
  title: 'ConsensusAI',
  description: 'O melhor produto com o consenso de múltiplas IA — grátis.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'ConsensusAI' },
  other: { 'mobile-web-app-capable': 'yes' },
}

export const viewport = {
  themeColor: '#080c14',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-PT">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
      </head>
      <body>{children}</body>
    </html>
  )
}
