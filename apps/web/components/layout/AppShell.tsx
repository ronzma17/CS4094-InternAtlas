'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '../../lib/utils'

const links = [
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/tracker', label: 'Tracker' },
  { href: '/insights', label: 'Insights' },
  { href: '/profile', label: 'Profile' },
  { href: '/admin/import', label: 'Admin' },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <div className='min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100'>
      <div className='mx-auto flex max-w-7xl gap-4 p-4'>
        <aside className='hidden w-56 shrink-0 rounded-xl border border-slate-200 bg-white p-3 md:block dark:border-slate-800 dark:bg-slate-900'>
          <p className='mb-4 px-2 text-sm font-semibold'>InternAtlas</p>
          <nav className='space-y-1'>
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={cn('block rounded-lg px-3 py-2 text-sm transition', path?.startsWith(link.href) ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800')}>
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className='flex-1'>
          <header className='mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900'>
            <div>
              <p className='text-lg font-semibold'>Dashboard</p>
            </div>
            <button className='rounded-lg border px-3 py-1 text-sm dark:border-slate-700' onClick={() => setDark((v) => !v)}>
              {dark ? 'Light' : 'Dark'} mode
            </button>
          </header>
          {children}
        </div>
      </div>
    </div>
  )
}
