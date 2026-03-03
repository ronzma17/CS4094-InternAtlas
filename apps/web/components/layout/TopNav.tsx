'use client'

import Link from 'next/link'
import { ThemeToggle } from '../theme/ThemeToggle'
import { Avatar } from '../ui/Avatar'
import { Container } from '../ui/Card'
import { Input } from '../ui/Input'

export function TopNav({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <header className='sticky top-0 z-40 border-b bg-card/95 backdrop-blur shadow-sm'>
      <Container className='flex h-14 items-center justify-between gap-4 py-2'>
        <div className='flex items-center gap-4'>
          <button
            className='focus-ring rounded-md border bg-background px-2 py-1 lg:hidden text-muted-foreground hover:bg-muted'
            aria-label='Open navigation'
            onClick={onMenuToggle}
          >
            ☰
          </button>
          <Link href='/opportunities' className='flex items-center gap-2'>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold">IA</div>
            <span className='hidden sm:block text-xl font-bold tracking-tight text-foreground'>InternAtlas</span>
          </Link>
        </div>

        <div className='flex-1 max-w-md mx-auto hidden md:block'>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">🔍</span>
            <Input
              aria-label='Global search'
              placeholder='Search jobs, skills, companies...'
              className='w-full bg-muted/50 pl-9 border-none focus-visible:ring-1 focus-visible:bg-background h-9 rounded-md transition-colors'
            />
          </div>
        </div>

        <div className='flex items-center gap-3 md:gap-4'>
          <div className="hidden sm:flex lg:hidden items-center text-muted-foreground gap-4 text-sm font-medium mr-2">
            <Link href="/opportunities" className="hover:text-foreground flex flex-col items-center gap-1 transition-colors">
              <span className="text-lg leading-none">⌂</span>
              <span className="text-[10px] sm:block">Home</span>
            </Link>
            <Link href="/tracker" className="hover:text-foreground flex flex-col items-center gap-1 transition-colors">
              <span className="text-lg leading-none">◎</span>
              <span className="text-[10px] sm:block">Tracker</span>
            </Link>
            <Link href="/insights" className="hover:text-foreground flex flex-col items-center gap-1 transition-colors">
              <span className="text-lg leading-none">◩</span>
              <span className="text-[10px] sm:block">Insights</span>
            </Link>
          </div>
          <div className="h-6 w-px bg-border hidden sm:block lg:hidden mx-1"></div>
          <ThemeToggle />
          <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent transition-all hover:ring-primary/50">IA</Avatar>
        </div>
      </Container>
    </header>
  )
}
