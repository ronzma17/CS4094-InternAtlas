'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { api } from '../../lib/api'
import { cn } from '../../lib/utils'
import { ThemeToggle } from '../theme/ThemeToggle'
import { Button } from '../ui/Button'
import { Card, Container } from '../ui/Card'
import { Input } from '../ui/Input'

const navItems = [
  { href: '/opportunities', label: 'Opportunities', icon: '◧' },
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
          <p className='text-sm font-semibold'>Tips</p>
          <ul className='mt-2 space-y-2 text-sm text-muted-foreground'>
            <li>Tailor profile skills for better match scores.</li>
            <li>Rate opportunities to improve relevance.</li>
            <li>Use tracker stages weekly for momentum.</li>
          </ul>
        </Card>
        <Card className='p-4'>
          <p className='text-sm font-semibold'>Trending tags</p>
          <div className='mt-3 flex flex-wrap gap-2 text-xs'>
            {['backend', 'ml', 'frontend', 'remote'].map((tag) => (
              <span key={tag} className='rounded-full border bg-muted/70 px-2 py-1'>#{tag}</span>
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
          <Input aria-label='Global search' placeholder='Search opportunities, tags, or companies' className='hidden max-w-xl flex-1 bg-background md:block' />
          <nav className='hidden items-center gap-1 lg:flex'>
            {navItems.map((item) => {
              const active = path?.startsWith(item.href)
              return (
                <Link key={item.href} href={item.href} className={cn('focus-ring rounded-md px-3 py-2 text-sm transition', active ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground')}>
                  <span className='mr-1' aria-hidden>{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <ThemeToggle />
        </Container>
      </header>

      <Container className='grid gap-4 py-6 lg:grid-cols-[240px_minmax(0,1fr)_290px]'>
        <aside className='hidden space-y-4 lg:block'>
          <Card className='p-4'>
            <p className='text-xs uppercase text-muted-foreground'>Welcome</p>
            <p className='mt-1 font-semibold'>Your internship dashboard</p>
            <p className='mt-2 text-sm text-muted-foreground'>{isAdmin ? 'Admin access enabled' : 'Candidate mode'}</p>
          </Card>
          <Card className='p-4'>
            <p className='text-sm font-semibold'>Quick links</p>
            <div className='mt-2 space-y-1 text-sm'>
              <Link href='/opportunities?saved_only=true' className='block rounded-md px-2 py-1 hover:bg-muted'>Saved opportunities</Link>
              <Link href='/tracker' className='block rounded-md px-2 py-1 hover:bg-muted'>Application tracker</Link>
              <Link href='/profile' className='block rounded-md px-2 py-1 hover:bg-muted'>Edit profile</Link>
            </div>
          </Card>
        </aside>

        <main>{children}</main>
        <aside className='hidden lg:block'>{rightRail}</aside>
      </Container>

      {open ? (
        <div className='fixed inset-0 z-50 bg-black/45 lg:hidden'>
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
