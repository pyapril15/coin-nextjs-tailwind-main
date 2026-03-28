import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/providers/AuthProvider'
import ScrollToTop from '@/components/scroll-to-top'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import ToasterProvider from '@/providers/ToasterProvider'

const font = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${font.className}`}>
        <AuthProvider>
          <ToasterProvider />
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
        </AuthProvider>
      </body>
    </html>
  )
}
