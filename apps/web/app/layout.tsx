import './globals.css'
import { AppShell } from '../components/layout/AppShell'
import { ToastProvider } from '../components/ui/Toast'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <ToastProvider>
          <AppShell>{children}</AppShell>
        </ToastProvider>
      </body>
    </html>
  )
}
