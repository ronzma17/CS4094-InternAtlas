'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ThemeToggle } from '../theme/ThemeToggle'
import { Button } from '../ui/Button'
import { Container } from '../ui/Card'
import { cn } from '../../lib/utils'

const links = [
  { href: '/opportunities', label: '💼 Opportunities' },
  { href: '/tracker', label: '🧭 Tracker' },
  { href: '/insights', label: '📈 Insights' },
  { href: '/profile', label: '👤 Profile' },
  { href: '/admin/import', label: '🛠 Admin import' },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className='min-h-screen bg-background'>
      <Container className='flex gap-4 py-4'>
        <aside className='hidden w-72 shrink-0 rounded-xl border bg-card p-4 shadow-soft lg:block'>
          <p className='mb-4 text-lg font-semibold'>InternAtlas</p>
          <nav className='space-y-1'>
            {links.map((link) => {
              const active = path?.startsWith(link.href)
              return <Link key={link.href} href={link.href} className={cn('block rounded-lg px-3 py-2 text-sm transition', active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>{link.label}</Link>
            })}
          </nav>
        </aside>

        <div className='flex-1 space-y-4'>
          <header className='sticky top-4 z-40 flex items-center justify-between rounded-xl border bg-card px-4 py-3 shadow-soft'>
            <div className='flex items-center gap-2'>
              <Button variant='ghost' size='icon' className='lg:hidden' onClick={() => setOpen(true)}>☰</Button>
              <div>
                <p className='text-xs text-muted-foreground'>Internship command center</p>
                <p className='font-semibold'>Dashboard</p>
              </div>
            </div>
            <ThemeToggle />
          </header>
          <main>{children}</main>
        </div>
      </Container>

      {open ? (
        <div className='fixed inset-0 z-50 bg-black/50 lg:hidden'>
          <aside className='h-full w-72 space-y-3 border-r bg-card p-4'>
            <div className='flex items-center justify-between'><p className='font-semibold'>Navigation</p><Button variant='ghost' size='icon' onClick={() => setOpen(false)}>✕</Button></div>
            {links.map((link) => {
              const active = path?.startsWith(link.href)
              return <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={cn('block rounded-lg px-3 py-2 text-sm', active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>{link.label}</Link>
            })}
          </aside>
        </div>
      ) : null}
    </div>
  )
}
