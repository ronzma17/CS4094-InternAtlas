'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { api } from '../../lib/api'
import { cn } from '../../lib/utils'
import { ThemeToggle } from '../theme/ThemeToggle'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { Card, Container } from '../ui/Card'
import { Input } from '../ui/Input'

const navItems = [
  { href: '/opportunities', label: 'Home', icon: '⌂' },
  { href: '/tracker', label: 'Tracker', icon: '◎' },
  { href: '/insights', label: 'Insights', icon: '◩' },
  { href: '/profile', label: 'Profile', icon: '◉' },
  { href: '/admin/import', label: 'Admin', icon: '◈' },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    api.getMe().then((me) => setIsAdmin(me.is_admin)).catch(() => setIsAdmin(false))
  }, [])

  const rightRail = useMemo(
    () => (
      <div className='space-y-4'>
        <Card className='p-4'>
          <p className='text-sm font-semibold'>Network snapshot</p>
          <ul className='mt-2 space-y-2 text-sm text-muted-foreground'>
            <li>3 profiles viewed this week.</li>
            <li>2 saved opportunities matched your top skills.</li>
            <li>Keep applying to improve shortlist confidence.</li>
          </ul>
        </Card>
        <Card className='p-4'>
          <p className='text-sm font-semibold'>Trending tags</p>
          <div className='mt-3 flex flex-wrap gap-2 text-xs'>
            {['backend', 'ml', 'frontend', 'remote'].map((tag) => (
              <span key={tag} className='rounded-full border bg-muted/70 px-2 py-1 text-muted-foreground'>#{tag}</span>
            ))}
          </div>
        </Card>
      </div>
    ),
    [],
  )

  return (
    <div className='min-h-screen bg-background'>
      <header className='sticky top-0 z-40 border-b bg-card/95 backdrop-blur'>
        <Container className='flex items-center gap-3 py-3'>
          <button className='focus-ring rounded-md border bg-background px-2 py-1 lg:hidden' aria-label='Open navigation' onClick={() => setOpen(true)}>☰</button>
          <Link href='/opportunities' className='text-lg font-semibold tracking-tight'>InternAtlas</Link>
          <Input aria-label='Global search' placeholder='Search people, opportunities, and tags' className='hidden max-w-xl flex-1 bg-background md:block' />
          <ThemeToggle />
          <Avatar>IA</Avatar>
        </Container>
      </header>

      <Container className='grid gap-4 py-6 lg:grid-cols-[230px_minmax(0,1fr)_290px]'>
        <aside className='hidden space-y-4 lg:block'>
          <Card className='p-3'>
            <nav className='space-y-1'>
              {navItems.map((item) => {
                const active = path?.startsWith(item.href)
                return (
                  <Link key={item.href} href={item.href} className={cn('focus-ring block rounded-md px-3 py-2 text-sm transition', active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
                    <span className='mr-2' aria-hidden>{item.icon}</span>{item.label}
                  </Link>
                )
              })}
            </nav>
          </Card>
          <Card className='p-4'>
            <p className='text-xs uppercase text-muted-foreground'>Workspace mode</p>
            <p className='mt-1 font-semibold'>{isAdmin ? 'Admin enabled' : 'Candidate mode'}</p>
          </Card>
        </aside>

        <main>{children}</main>
        <aside className='hidden lg:block'>{rightRail}</aside>
      </Container>

      {open ? (
        <div className='fixed inset-0 z-50 bg-foreground/45 lg:hidden'>
          <aside className='h-full w-72 space-y-3 border-r bg-card p-4'>
            <div className='flex items-center justify-between'>
              <p className='font-semibold'>Navigation</p>
              <Button variant='ghost' size='icon' aria-label='Close navigation' onClick={() => setOpen(false)}>✕</Button>
            </div>
            {navItems.map((item) => {
              const active = path?.startsWith(item.href)
              return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn('block rounded-lg px-3 py-2 text-sm', active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>{item.label}</Link>
            })}
          </aside>
        </div>
      ) : null}
    </div>
  )
}
