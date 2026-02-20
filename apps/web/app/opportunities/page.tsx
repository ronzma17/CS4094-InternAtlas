'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { Skeleton } from '../../components/ui/Skeleton'

export default function Opportunities() {
  const [items, setItems] = useState<any[]>([])
  const [q, setQ] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const query = `?query=${encodeURIComponent(q)}&location=${encodeURIComponent(location)}`
      const data = await api.listOpportunities(query)
      setItems(data)
    } catch (e: any) {
      setError(e.message)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className='space-y-4'>
      <Card className='sticky top-4 z-10'>
        <h1 className='text-2xl font-semibold'>Opportunities</h1>
        <p className='mt-1 text-sm text-slate-500'>Search internships and sort by relevance score.</p>
        <div className='mt-3 grid gap-2 md:grid-cols-3'>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder='Search title, org, keyword' />
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder='Location' />
          <Button onClick={load}>Apply filters</Button>
        </div>
      </Card>

      {loading ? (
        <div className='space-y-2'>
          <Skeleton className='h-24' />
          <Skeleton className='h-24' />
          <Skeleton className='h-24' />
        </div>
      ) : error ? (
        <EmptyState title='Could not load opportunities' description={error} action={<Button onClick={load}>Try again</Button>} />
      ) : items.length === 0 ? (
        <EmptyState title='No results found' description='Try broadening your search or clearing filters.' action={<Button onClick={() => { setQ(''); setLocation(''); load() }}>Clear filters</Button>} />
      ) : (
        <div className='space-y-3'>
          {items.map((item) => (
            <Card key={item.id} className='transition hover:shadow-md'>
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <Link className='text-lg font-semibold text-indigo-600 hover:underline' href={`/opportunities/${item.id}`}>
                    {item.title}
                  </Link>
                  <p className='text-sm text-slate-500'>{item.org} • {item.location} • {item.deadline_date ?? 'No deadline'}</p>
                </div>
                <Badge>{item.match_score}</Badge>
              </div>
              <div className='mt-3 flex flex-wrap gap-2'>
                {(item.explanation?.overlap_skills || []).slice(0, 4).map((skill: string) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
