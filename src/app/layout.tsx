import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'GolfGives — Play, Win, Give Back',
    template: '%s | GolfGives',
  },
  description:
    'A subscription golf platform where your game funds charities and enters you into monthly prize draws. Modern, fair, and built for people who care.',
  keywords: ['golf', 'charity', 'prize draw', 'subscription', 'stableford'],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'GolfGives',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
