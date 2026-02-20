'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../../lib/api'
import { formatDate } from '../../lib/utils'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, Section } from '../../components/ui/Card'
import { DataTable } from '../../components/ui/Table'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { Skeleton } from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'

export default function Opportunities() {
  const [items, setItems] = useState<any[]>([])
  const [q, setQ] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const toast = useToast()

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const query = `?query=${encodeURIComponent(q)}&location=${encodeURIComponent(location)}`
      setItems(await api.listOpportunities(query))
      setPage(1)
    } catch (e: any) {
      setError(e.message)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const perPage = 8
  const totalPages = Math.max(1, Math.ceil(items.length / perPage))
  const pageItems = useMemo(() => items.slice((page - 1) * perPage, page * perPage), [items, page])

  return (
    <Section>
      <Card>
        <div className='grid gap-3 lg:grid-cols-[2fr_1fr_auto]'>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder='Search title, org, or keyword' />
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder='Location' />
          <Button onClick={load}>Apply filters</Button>
        </div>
      </Card>

      {loading ? <div className='space-y-2'><Skeleton className='h-24' /><Skeleton className='h-72' /></div> : null}
      {!loading && error ? <EmptyState title='Could not load opportunities' description={error} action={<Button onClick={load}>Try again</Button>} /> : null}
      {!loading && !error && items.length === 0 ? <EmptyState title='No matches yet' description='Try broadening your filters.' /> : null}

      {!loading && !error && items.length > 0 ? (
        <DataTable
          headers={['Role', 'Match', 'Top overlap', 'Actions']}
          rows={pageItems.map((item) => [
            <div key={`role-${item.id}`}>
              <Link className='font-semibold text-primary hover:underline' href={`/opportunities/${item.id}`}>{item.title}</Link>
              <p className='text-xs text-muted-foreground'>{item.org} · {item.location} · {formatDate(item.deadline_date)}</p>
            </div>,
            <Badge key={`score-${item.id}`}>{item.match_score}%</Badge>,
            <div key={`tags-${item.id}`} className='flex flex-wrap gap-1'>{(item.explanation?.overlap_skills || []).slice(0, 3).map((skill: string) => <Badge key={skill}>{skill}</Badge>)}</div>,
            <div key={`actions-${item.id}`} className='flex gap-2'>
              <Button variant='secondary' size='sm' onClick={async () => { await api.saveOpportunity(item.id); toast('Opportunity saved') }}>Save</Button>
              <Button size='sm' onClick={() => window.location.assign(`/opportunities/${item.id}`)}>View</Button>
            </div>,
          ])}
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      ) : null}
    </Section>
  )
}
