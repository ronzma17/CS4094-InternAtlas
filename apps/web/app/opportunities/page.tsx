'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { api, ApiError } from '../../lib/api'
import { formatDate } from '../../lib/utils'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, Section } from '../../components/ui/Card'
import { Drawer } from '../../components/ui/Drawer'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Skeleton } from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'

type Opportunity = {
  id: number
  title: string
  org: string
  description: string
  location: string
  tags: string[]
  deadline_date: string | null
  match_score: number
  explanation: { overlap_skills: string[]; snippets: string[] }
}

const sortOptions = [
  { value: 'match', label: 'Best match' },
  { value: 'deadline', label: 'Deadline soonest' },
  { value: 'title', label: 'Title A-Z' },
]

export default function Opportunities() {
  const router = useRouter()
  const toast = useToast()

  const [items, setItems] = useState<Opportunity[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [q, setQ] = useState('')
  const [location, setLocation] = useState('')
  const [tag, setTag] = useState('')
  const [savedOnly, setSavedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('match')
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const syncRoute = (nextSelected?: number | null) => {
    const params = new URLSearchParams()
    if (q) params.set('query', q)
    if (location) params.set('location', location)
    if (tag) params.set('tag', tag)
    if (savedOnly) params.set('saved_only', 'true')
    if (nextSelected) params.set('selected', String(nextSelected))
    router.replace(`/opportunities${params.size ? `?${params.toString()}` : ''}`)
  }

  const load = async (selectedFromUrl?: number | null) => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (q) params.set('query', q)
      if (location) params.set('location', location)
      if (tag) params.set('tag', tag)
      if (savedOnly) params.set('saved_only', 'true')
      const data = await api.listOpportunities(params.size ? `?${params.toString()}` : '')
      setItems(data)
      const initial = data.find((item) => item.id === selectedFromUrl)?.id || data[0]?.id || null
      setSelected(initial)
      syncRoute(initial)
    } catch (e: any) {
      setItems([])
      const message = e instanceof ApiError ? e.message : 'Unable to reach API. Please retry.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const initialQuery = params.get('query') || ''
    const initialLocation = params.get('location') || ''
    const initialTag = params.get('tag') || ''
    const initialSavedOnly = params.get('saved_only') === 'true'
    const initialSelected = Number(params.get('selected')) || null

    setQ(initialQuery)
    setLocation(initialLocation)
    setTag(initialTag)
    setSavedOnly(initialSavedOnly)

    api.getMe().then((me) => setIsAdmin(me.is_admin)).catch(() => setIsAdmin(false))

    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const routeParams = new URLSearchParams()
        if (initialQuery) routeParams.set('query', initialQuery)
        if (initialLocation) routeParams.set('location', initialLocation)
        if (initialTag) routeParams.set('tag', initialTag)
        if (initialSavedOnly) routeParams.set('saved_only', 'true')
        const data = await api.listOpportunities(routeParams.size ? `?${routeParams.toString()}` : '')
        setItems(data)
        const initial = data.find((item) => item.id === initialSelected)?.id || data[0]?.id || null
        setSelected(initial)
      } catch (e: any) {
        setItems([])
        setError(e.message || 'Unable to reach API. Please retry.')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const filtered = useMemo(() => {
    const sorted = [...items]
    if (sortBy === 'deadline') sorted.sort((a, b) => (a.deadline_date || '9999').localeCompare(b.deadline_date || '9999'))
    else if (sortBy === 'title') sorted.sort((a, b) => a.title.localeCompare(b.title))
    else sorted.sort((a, b) => b.match_score - a.match_score)
    return sorted
  }, [items, sortBy])

  const selectedItem = filtered.find((item) => item.id === selected)

  const runSeed = async () => {
    try {
      setDetailsLoading(true)
      await api.runSeed()
      toast('Demo opportunities imported')
      await load()
    } catch (e: any) {
      setError(e.message || 'Only admins can seed demo data.')
    } finally {
      setDetailsLoading(false)
    }
  }

  const detailContent = selectedItem ? (
    <>
      <h2 className='text-xl'>{selectedItem.title}</h2>
      <p className='mt-1 text-sm text-muted-foreground'>{selectedItem.org} · {selectedItem.location} · {formatDate(selectedItem.deadline_date)}</p>
      <p className='mt-3 text-sm'>{selectedItem.description}</p>
      <div className='mt-4 flex flex-wrap gap-2'>{(selectedItem.tags || []).map((entry) => <Badge key={`${selectedItem.id}-${entry}`}>{entry}</Badge>)}</div>
      <div className='mt-4 space-y-2'>{(selectedItem.explanation?.snippets || []).map((snippet, idx) => <p key={`${selectedItem.id}-snippet-${idx}`} className='rounded-lg border bg-muted/40 p-2 text-sm [&_mark]:rounded [&_mark]:bg-accent/25 [&_mark]:px-1' dangerouslySetInnerHTML={{ __html: snippet }} />)}</div>
      <div className='mt-5 flex flex-wrap gap-2'>
        <Button size='sm' onClick={async () => { await api.saveOpportunity(selectedItem.id); toast('Saved opportunity') }}>Save</Button>
        <Button size='sm' variant='secondary' onClick={async () => { await api.trackerCreate({ title_snapshot: selectedItem.title, org_snapshot: selectedItem.org, opportunity_id: selectedItem.id }); toast('Added to tracker') }}>Add to tracker</Button>
        {[1, 2, 3, 4, 5].map((rating) => <Button key={rating} size='sm' variant='ghost' onClick={async () => { await api.rateOpportunity(selectedItem.id, rating); toast(`Rated ${rating}/5`) }}>{rating}</Button>)}
      </div>
    </>
  ) : <p className='text-sm text-muted-foreground'>Select an opportunity to inspect details.</p>

  return (
    <Section className='space-y-4'>
      <Card className='p-4'>
        <div className='grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_auto]'>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder='Search roles, orgs, keywords' aria-label='Opportunity search query' />
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder='Location' aria-label='Location filter' />
          <Input value={tag} onChange={(e) => setTag(e.target.value)} placeholder='Tag filter (e.g. backend)' aria-label='Tag filter' />
          <Button onClick={() => load()}>Apply</Button>
        </div>
        <div className='mt-3 flex flex-wrap items-center gap-2'>
          <Button variant={savedOnly ? 'primary' : 'secondary'} size='sm' onClick={() => setSavedOnly((prev) => !prev)} aria-label='Toggle saved only'>Saved only</Button>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label='Sort opportunities'>
            {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </Select>
          {['remote', 'python', 'frontend'].map((chip) => (
            <button key={chip} className='focus-ring rounded-full border bg-muted/70 px-3 py-1 text-xs hover:bg-muted' onClick={() => setTag(chip)}>
              #{chip}
            </button>
          ))}
        </div>
      </Card>

      {error ? <Card className='border-danger/40 bg-danger/10 p-3 text-sm'><div className='flex items-center justify-between gap-3'><p>{error}</p><Button size='sm' variant='secondary' onClick={() => load()}>Retry</Button></div></Card> : null}

      {loading ? <div className='grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)_360px]'><Skeleton className='h-80' /><Skeleton className='h-80' /><Skeleton className='h-80' /></div> : null}

      {!loading && !error && filtered.length === 0 ? (
        <EmptyState title='No opportunities yet' description={isAdmin ? 'Seed demo opportunities to make this workspace useful immediately.' : 'Ask an admin to seed demo data so everyone can explore matches.'} action={isAdmin ? <Button onClick={runSeed} disabled={detailsLoading}>{detailsLoading ? 'Seeding…' : 'Seed demo data'}</Button> : undefined} />
      ) : null}

      {!loading && !error && filtered.length > 0 ? (
        <div className='grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)_360px]'>
          <Card className='h-fit p-4 xl:sticky xl:top-24'>
            <p className='text-sm font-semibold'>Filters</p>
            <p className='mt-1 text-xs text-muted-foreground'>Refine by location, tags, and saved status.</p>
            <div className='mt-4 space-y-2 text-sm'>
              <p><span className='text-muted-foreground'>Query:</span> {q || 'Any'}</p>
              <p><span className='text-muted-foreground'>Location:</span> {location || 'Any'}</p>
              <p><span className='text-muted-foreground'>Tag:</span> {tag || 'Any'}</p>
              <p><span className='text-muted-foreground'>Saved only:</span> {savedOnly ? 'Yes' : 'No'}</p>
            </div>
          </Card>

          <Card className='space-y-2 p-2'>
            {filtered.map((item) => {
              const active = item.id === selected
              return (
                <button key={item.id} className={`focus-ring w-full rounded-lg border p-3 text-left transition ${active ? 'border-primary bg-muted/80' : 'hover:bg-muted/50'}`} onClick={() => { setSelected(item.id); syncRoute(item.id) }}>
                  <div className='flex items-start justify-between gap-2'>
                    <div><p className='font-semibold'>{item.title}</p><p className='text-xs text-muted-foreground'>{item.org} · {item.location} · {formatDate(item.deadline_date)}</p></div>
                    <Badge>{item.match_score}%</Badge>
                  </div>
                  <div className='mt-2 flex flex-wrap gap-1'>{(item.explanation?.overlap_skills || []).slice(0, 3).map((skill) => <Badge key={`${item.id}-${skill}`}>{skill}</Badge>)}</div>
                </button>
              )
            })}
          </Card>

          <Card className='hidden p-4 xl:block'>
            {detailContent}
          </Card>

          <Button className='xl:hidden' onClick={() => setMobileOpen(true)} disabled={!selectedItem}>View selected opportunity</Button>
          <Drawer open={mobileOpen} title='Opportunity details' onClose={() => setMobileOpen(false)}>
            {detailContent}
          </Drawer>
        </div>
      ) : null}
    </Section>
  )
}
