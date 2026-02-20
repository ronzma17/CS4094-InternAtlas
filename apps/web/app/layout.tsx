import './globals.css'
import Link from 'next/link'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html><body><nav className='p-3 bg-white border-b flex gap-3'>
    <Link href='/opportunities'>Opportunities</Link><Link href='/tracker'>Tracker</Link><Link href='/insights'>Insights</Link><Link href='/profile'>Profile</Link><Link href='/admin/import'>Admin</Link>
  </nav><main className='p-4 max-w-5xl mx-auto'>{children}</main></body></html>
}
