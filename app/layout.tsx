import type { Metadata } from 'next'
import { ClerkAuthProvider } from '@webwaka/core-auth-ui'

export const metadata: Metadata = {
  title: 'WebWaka Partner Dashboard',
  description: 'Partner Dashboard for WebWaka Suite',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkAuthProvider>
      <html lang="en">
        <body style={{ margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' }}>
          {children}
        </body>
      </html>
    </ClerkAuthProvider>
  )
}
